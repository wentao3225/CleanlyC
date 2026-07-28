import { readdir, stat, access, constants } from 'fs/promises'
import { join, extname } from 'path'
import type { Dirent } from 'fs'
import type { ScannerConfig, ScannerContext, ScannerResult } from './types'
import type { ScanItem } from '../../shared/types'
import { resolvePath } from './types'

function createMatcher(patterns: string[]): (name: string) => boolean {
  if (patterns.length === 0 || patterns.includes('*')) return () => true
  return (name: string) => {
    return patterns.some(pattern => {
      const regex = new RegExp(
        '^' + pattern.replace(/\*/g, '.*').replace(/\?/g, '.') + '$',
        'i'
      )
      return regex.test(name)
    })
  }
}

async function dirExists(p: string): Promise<boolean> {
  try {
    await access(p, constants.R_OK)
    return true
  } catch {
    return false
  }
}

async function walkDir(
  dirPath: string,
  config: ScannerConfig,
  context: ScannerContext,
  matches: ScanItem[],
  depth: number = 0
): Promise<void> {
  if (depth > (config.maxDepth ?? 10)) return
  if (context.signal.aborted) return

  const matcher = createMatcher(config.filePatterns ?? [])

  let entries: Dirent[]
  try {
    entries = await readdir(dirPath, { withFileTypes: true })
  } catch {
    return
  }

  for (const entry of entries) {
    if (context.signal.aborted) return

    // Skip symlinks if configured
    if (config.skipSymlinks && entry.isSymbolicLink()) continue

    const fullPath = join(dirPath, entry.name)

    if (entry.isDirectory()) {
      // Empty folder detection
      if (config.id === 'empty-folders') {
        let subEntries: string[]
        try {
          subEntries = await readdir(fullPath)
        } catch {
          continue
        }
        if (subEntries.length === 0) {
          let fileStat: import('fs').Stats
          try {
            fileStat = await stat(fullPath)
          } catch {
            continue
          }
          matches.push({
            id: `${config.id}-${matches.length}`,
            category: config.category,
            path: fullPath,
            size: 0,
            fileCount: 0,
            lastAccessed: Math.floor(fileStat.atimeMs),
            lastModified: Math.floor(fileStat.mtimeMs),
            fileType: 'folder',
            isSystemDir: config.isSystemDir,
            recoverable: config.recoverable
          })
        }
      }
      await walkDir(fullPath, config, context, matches, depth + 1)
    } else if (entry.isFile() || entry.isSymbolicLink()) {
      if (!matcher(entry.name)) continue

      let fileStat: import('fs').Stats
      try {
        fileStat = await stat(fullPath)
      } catch {
        continue
      }

      // Skip small files if minSize is set
      if (config.minSize && fileStat.size < config.minSize) continue

      matches.push({
        id: `${config.id}-${matches.length}`,
        category: config.category,
        path: fullPath,
        size: fileStat.size,
        fileCount: 1,
        lastAccessed: Math.floor(fileStat.atimeMs),
        lastModified: Math.floor(fileStat.mtimeMs),
        fileType: extname(entry.name).toLowerCase() || 'unknown',
        isSystemDir: config.isSystemDir,
        recoverable: config.recoverable
      })
    }
  }
}

export async function executeScanner(
  config: ScannerConfig,
  context: ScannerContext
): Promise<ScannerResult> {
  const items: ScanItem[] = []
  let totalSize = 0
  let totalFiles = 0

  for (const rawPath of config.paths) {
    if (context.signal.aborted) {
      return { scannerId: config.id, category: config.category, items, totalSize, totalFiles }
    }

    const resolvedPath = resolvePath(rawPath)
    const exists = await dirExists(resolvedPath)
    if (!exists) continue

    context.onProgress(0, 0, `正在扫描 ${config.name}...`)

    await walkDir(resolvedPath, config, context, items)
  }

  for (const item of items) {
    totalSize += item.size
    totalFiles += item.fileCount
  }

  return {
    scannerId: config.id,
    category: config.category,
    items,
    totalSize,
    totalFiles
  }
}