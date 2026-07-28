export interface DiskInfo {
  total: number
  used: number
  free: number
  percentUsed: number
  drive: string
  fsType: string
}

export interface ScanItem {
  id: string
  category: string
  path: string
  size: number
  fileCount: number
  lastAccessed?: number
  lastModified?: number
  fileType?: string
  isSystemDir?: boolean
  risk?: 'LOW' | 'MEDIUM' | 'HIGH'
  recoverable: boolean
}

export interface ScanProgress {
  phase: 'scanning' | 'completed' | 'error'
  current: number
  total: number
  currentItem: string
  message: string
}

export interface ScanRequest {
  items: string[]    // scan item IDs to include
  developerMode: boolean
}

export interface ScanResponse {
  items: ScanItem[]
  cancelled: boolean
  error?: string
}

export interface ScanResult {
  totalSize: number
  totalFiles: number
  items: ScanItem[]
  scanTime: string
  scanId: string
}

export interface AIAnalysisItem {
  id: string
  category: string
  risk: 'LOW' | 'MEDIUM' | 'HIGH'
  recommend: string
  recoverable: boolean
  reason: string
  importance: number
}

export interface AIAnalysisResult {
  summary: {
    totalSize: string
    score: number
    recommend: string
    aiSummary: string
  }
  items: AIAnalysisItem[]
}

export interface RecoveryRecord {
  id: string
  originalPath: string
  recoveryPath: string
  size: number
  deletedAt: string
  category: string
  expiresAt: string
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system'
  aiConfig: {
    baseUrl: string
    apiKey: string
    model: string
  }
  restoreRetentionDays: 7 | 14 | 30 | -1
  developerMode: boolean
  defaultScanItems: string[]
}

export const DEFAULT_SCAN_ITEMS = [
  'windows-temp',
  'windows-update-cache',
  'recycle-bin',
  'windows-logs',
  'thumbnail-cache',
  'prefetch',
  'softwaredistribution',
  'chrome-cache',
  'edge-cache',
  'firefox-cache',
  'wechat-cache',
  'qq-cache',
  'empty-folders',
  'large-files',
  'log-files'
]

export const DEVELOPER_SCAN_ITEMS = [
  'npm-cache',
  'pnpm-store',
  'yarn-cache',
  'maven-repo',
  'gradle-cache',
  'docker-cache',
  'android-studio-cache',
  'intellij-cache',
  'vscode-cache',
  'node-cache',
  'pip-cache',
  'cargo-cache',
  'go-mod-cache'
]

export const ALL_SCAN_ITEMS = [...DEFAULT_SCAN_ITEMS, ...DEVELOPER_SCAN_ITEMS]
