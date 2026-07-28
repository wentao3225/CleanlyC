import { executeScanner } from './scanner'
import { getScannerConfigs } from './types'
import type { ScannerConfig, ScannerContext, ScannerResult } from './types'
import type { ScanItem, ScanProgress, ScanRequest } from '../../shared/types'

export interface ScanSession {
  scanId: string
  startTime: number
  signal: AbortSignal
  controller: AbortController
  results: Map<string, ScannerResult>
  onProgress: ((progress: ScanProgress) => void) | null
}

let currentSession: ScanSession | null = null

function generateId(): string {
  return `scan_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

export interface ScanResult {
  items: ScanItem[]
  cancelled: boolean
  error?: string
}

export async function startScan(
  request: ScanRequest,
  onProgress: (progress: ScanProgress) => void
): Promise<ScanResult> {
  // Abort any existing session
  if (currentSession) {
    currentSession.controller.abort()
    currentSession = null
  }

  const controller = new AbortController()
  const scanId = generateId()
  const startTime = Date.now()

  const configs = getScannerConfigs(request.items, request.developerMode)

  if (configs.length === 0) {
    return { items: [], cancelled: false, error: '没有可扫描的项' }
  }

  const session: ScanSession = {
    scanId,
    startTime,
    signal: controller.signal,
    controller,
    results: new Map(),
    onProgress
  }
  currentSession = session

  const allItems: ScanItem[] = []
  let completedCount = 0

  for (const config of configs) {
    if (controller.signal.aborted) {
      currentSession = null
      return { items: allItems, cancelled: true }
    }

    const context: ScannerContext = {
      signal: controller.signal,
      onProgress: (_current, _total, item) => {
        onProgress({
          phase: 'scanning',
          current: completedCount,
          total: configs.length,
          currentItem: item,
          message: item
        })
      }
    }

    let result: ScannerResult
    try {
      result = await executeScanner(config, context)
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      result = {
        scannerId: config.id,
        category: config.category,
        items: [],
        totalSize: 0,
        totalFiles: 0,
        error: message
      }
    }

    session.results.set(config.id, result)
    allItems.push(...result.items)
    completedCount++

    onProgress({
      phase: 'scanning',
      current: completedCount,
      total: configs.length,
      currentItem: `${config.name} 扫描完成`,
      message: `${config.name} 扫描完成，发现 ${result.totalFiles} 个文件，共 ${formatBytes(result.totalSize)}`
    })
  }

  onProgress({
    phase: 'completed',
    current: completedCount,
    total: configs.length,
    currentItem: '扫描完成',
    message: '扫描完成'
  })

  currentSession = null
  return { items: allItems, cancelled: false }
}

export function abortScan(): void {
  if (currentSession) {
    currentSession.controller.abort()
    currentSession = null
  }
}

export function formatBytes(bytes: number): string {
  if (!bytes) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let unitIndex = 0
  let size = bytes
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }
  return `${size.toFixed(unitIndex > 0 ? 1 : 0)} ${units[unitIndex]}`
}