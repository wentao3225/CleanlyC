import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ScanItem, ScanProgress, ScanRequest, ScanResponse } from '../../../shared/types'

export const useScanStore = defineStore('scan', () => {
  const isScanning = ref(false)
  const scanItems = ref<ScanItem[]>([])
  const progress = ref<ScanProgress | null>(null)
  const error = ref<string | null>(null)
  const cleanup = ref<(() => void) | null>(null)
  const cancelled = ref(false)

  const totalSize = computed(() => {
    return scanItems.value.reduce((sum, item) => sum + item.size, 0)
  })

  const totalFiles = computed(() => {
    return scanItems.value.reduce((sum, item) => sum + item.fileCount, 0)
  })

  const groupedItems = computed(() => {
    const groups = new Map<string, ScanItem[]>()
    for (const item of scanItems.value) {
      const existing = groups.get(item.category) ?? []
      existing.push(item)
      groups.set(item.category, existing)
    }
    return groups
  })

  async function startScan(request: ScanRequest) {
    isScanning.value = true
    error.value = null
    scanItems.value = []
    progress.value = null
    cancelled.value = false

    const unsub = window.electronAPI.scan.onProgress((p: ScanProgress) => {
      progress.value = p
    })
    cleanup.value = unsub

    try {
      const response: ScanResponse = await window.electronAPI.scan.start(request)
      if (response.cancelled) {
        cancelled.value = true
      } else if (response.error) {
        error.value = response.error
      } else {
        scanItems.value = response.items
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : String(err)
    } finally {
      isScanning.value = false
      if (cleanup.value) {
        cleanup.value()
        cleanup.value = null
      }
    }
  }

  function abortScan() {
    window.electronAPI.scan.abort()
    isScanning.value = false
    if (cleanup.value) {
      cleanup.value()
      cleanup.value = null
    }
  }

  function clearResults() {
    scanItems.value = []
    progress.value = null
    error.value = null
    cancelled.value = false
  }

  function formatBytes(bytes: number): string {
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

  return {
    isScanning,
    scanItems,
    progress,
    error,
    cancelled,
    totalSize,
    totalFiles,
    groupedItems,
    startScan,
    abortScan,
    clearResults,
    formatBytes
  }
})