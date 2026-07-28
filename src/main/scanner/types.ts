import type { ScanItem } from '../../shared/types'

export interface ScannerConfig {
  id: string
  name: string
  category: string
  paths: string[]
  filePatterns?: string[]
  maxDepth?: number
  minSize?: number
  skipSymlinks?: boolean
  isSystemDir?: boolean
  recoverable: boolean
}

export interface ScannerContext {
  signal: AbortSignal
  onProgress: (current: number, total: number, item: string) => void
}

export interface ScannerResult {
  scannerId: string
  category: string
  items: ScanItem[]
  totalSize: number
  totalFiles: number
  error?: string
}

export const SCANNER_CONFIGS: ScannerConfig[] = [
  // ===== System =====
  {
    id: 'windows-temp',
    name: 'Windows Temp',
    category: '系统',
    paths: [
      'C:\\Windows\\Temp',
      '%TEMP%'
    ],
    filePatterns: ['*'],
    maxDepth: 10,
    isSystemDir: true,
    recoverable: false
  },
  {
    id: 'windows-update-cache',
    name: 'Windows Update Cache',
    category: '系统',
    paths: [
      'C:\\Windows\\SoftwareDistribution\\Download'
    ],
    filePatterns: ['*'],
    maxDepth: 5,
    isSystemDir: true,
    recoverable: false
  },
  {
    id: 'recycle-bin',
    name: '回收站',
    category: '系统',
    paths: [
      'C:\\$Recycle.Bin'
    ],
    filePatterns: ['*'],
    maxDepth: 10,
    isSystemDir: true,
    recoverable: true
  },
  {
    id: 'windows-logs',
    name: 'Windows 日志',
    category: '系统',
    paths: [
      'C:\\Windows\\Logs'
    ],
    filePatterns: ['*.log', '*.etl', '*.evtx'],
    maxDepth: 10,
    isSystemDir: true,
    recoverable: false
  },
  {
    id: 'thumbnail-cache',
    name: '缩略图缓存',
    category: '系统',
    paths: [
      '%LOCALAPPDATA%\\Microsoft\\Windows\\Explorer'
    ],
    filePatterns: ['thumbcache_*', '*.db'],
    maxDepth: 3,
    isSystemDir: true,
    recoverable: false
  },
  {
    id: 'prefetch',
    name: 'Prefetch',
    category: '系统',
    paths: [
      'C:\\Windows\\Prefetch'
    ],
    filePatterns: ['*.pf'],
    maxDepth: 2,
    isSystemDir: true,
    recoverable: false
  },
  {
    id: 'softwaredistribution',
    name: 'SoftwareDistribution',
    category: '系统',
    paths: [
      'C:\\Windows\\SoftwareDistribution'
    ],
    filePatterns: ['*'],
    maxDepth: 10,
    isSystemDir: true,
    recoverable: false
  },

  // ===== Browser =====
  {
    id: 'chrome-cache',
    name: 'Chrome Cache',
    category: '浏览器',
    paths: [
      '%LOCALAPPDATA%\\Google\\Chrome\\User Data\\Default\\Cache',
      '%LOCALAPPDATA%\\Google\\Chrome\\User Data\\Default\\Code Cache',
      '%LOCALAPPDATA%\\Google\\Chrome\\User Data\\Default\\Service Worker\\CacheStorage'
    ],
    filePatterns: ['*'],
    maxDepth: 5,
    recoverable: false
  },
  {
    id: 'edge-cache',
    name: 'Edge Cache',
    category: '浏览器',
    paths: [
      '%LOCALAPPDATA%\\Microsoft\\Edge\\User Data\\Default\\Cache',
      '%LOCALAPPDATA%\\Microsoft\\Edge\\User Data\\Default\\Code Cache',
      '%LOCALAPPDATA%\\Microsoft\\Edge\\User Data\\Default\\Service Worker\\CacheStorage'
    ],
    filePatterns: ['*'],
    maxDepth: 5,
    recoverable: false
  },
  {
    id: 'firefox-cache',
    name: 'Firefox Cache',
    category: '浏览器',
    paths: [
      '%LOCALAPPDATA%\\Mozilla\\Firefox\\Profiles'
    ],
    filePatterns: ['cache2', '*.cache'],
    maxDepth: 8,
    recoverable: false
  },

  // ===== Software =====
  {
    id: 'wechat-cache',
    name: '微信缓存',
    category: '软件',
    paths: [
      '%APPDATA%\\Tencent\\WeChat\\XPlugin\\Plugins',
      '%DOCUMENTS%\\WeChat Files'
    ],
    filePatterns: ['*'],
    maxDepth: 10,
    recoverable: false
  },
  {
    id: 'qq-cache',
    name: 'QQ 缓存',
    category: '软件',
    paths: [
      '%APPDATA%\\Tencent\\QQ'
    ],
    filePatterns: ['*'],
    maxDepth: 10,
    recoverable: false
  },

  // ===== Files =====
  {
    id: 'empty-folders',
    name: '空文件夹',
    category: '文件',
    paths: [
      'C:\\Users',
      'C:\\ProgramData'
    ],
    filePatterns: [],
    maxDepth: 8,
    recoverable: true
  },
  {
    id: 'large-files',
    name: '大文件',
    category: '文件',
    paths: [
      'C:\\Users',
      'C:\\'
    ],
    filePatterns: ['*'],
    maxDepth: 6,
    minSize: 104857600, // 100MB
    skipSymlinks: true,
    recoverable: true
  },
  {
    id: 'log-files',
    name: '日志文件',
    category: '文件',
    paths: [
      'C:\\Users',
      'C:\\ProgramData',
      'C:\\Windows\\Logs'
    ],
    filePatterns: ['*.log'],
    maxDepth: 8,
    recoverable: true
  },

  // ===== Developer (hidden unless developer mode) =====
  {
    id: 'npm-cache',
    name: 'npm Cache',
    category: '开发者',
    paths: [
      '%APPDATA%\\npm-cache',
      '%LOCALAPPDATA%\\npm-cache'
    ],
    filePatterns: ['*'],
    maxDepth: 5,
    recoverable: false
  },
  {
    id: 'pnpm-store',
    name: 'pnpm Store',
    category: '开发者',
    paths: [
      '%LOCALAPPDATA%\\pnpm\\store'
    ],
    filePatterns: ['*'],
    maxDepth: 5,
    recoverable: false
  },
  {
    id: 'yarn-cache',
    name: 'Yarn Cache',
    category: '开发者',
    paths: [
      '%LOCALAPPDATA%\\Yarn\\Cache'
    ],
    filePatterns: ['*'],
    maxDepth: 5,
    recoverable: false
  },
  {
    id: 'maven-repo',
    name: 'Maven Repository',
    category: '开发者',
    paths: [
      '%USERPROFILE%\\.m2\\repository'
    ],
    filePatterns: ['*'],
    maxDepth: 8,
    recoverable: false
  },
  {
    id: 'gradle-cache',
    name: 'Gradle Cache',
    category: '开发者',
    paths: [
      '%USERPROFILE%\\.gradle\\caches'
    ],
    filePatterns: ['*'],
    maxDepth: 8,
    recoverable: false
  },
  {
    id: 'docker-cache',
    name: 'Docker Cache',
    category: '开发者',
    paths: [
      '%USERPROFILE%\\AppData\\Local\\Docker'
    ],
    filePatterns: ['*'],
    maxDepth: 8,
    recoverable: false
  },
  {
    id: 'android-studio-cache',
    name: 'Android Studio Cache',
    category: '开发者',
    paths: [
      '%USERPROFILE%\\.android\\cache',
      '%USERPROFILE%\\.AndroidStudio*'
    ],
    filePatterns: ['*'],
    maxDepth: 8,
    recoverable: false
  },
  {
    id: 'intellij-cache',
    name: 'IntelliJ IDEA Cache',
    category: '开发者',
    paths: [
      '%APPDATA%\\JetBrains'
    ],
    filePatterns: ['*'],
    maxDepth: 8,
    recoverable: false
  },
  {
    id: 'vscode-cache',
    name: 'VSCode Cache',
    category: '开发者',
    paths: [
      '%APPDATA%\\Code\\Cache',
      '%APPDATA%\\Code\\CachedData',
      '%APPDATA%\\Code\\CachedExtensions'
    ],
    filePatterns: ['*'],
    maxDepth: 5,
    recoverable: false
  },
  {
    id: 'node-cache',
    name: 'Node Cache',
    category: '开发者',
    paths: [
      '%APPDATA%\\npm-cache',
      '%LOCALAPPDATA%\\node-gyp\\Cache'
    ],
    filePatterns: ['*'],
    maxDepth: 5,
    recoverable: false
  },
  {
    id: 'pip-cache',
    name: 'Python pip Cache',
    category: '开发者',
    paths: [
      '%LOCALAPPDATA%\\pip\\Cache'
    ],
    filePatterns: ['*'],
    maxDepth: 5,
    recoverable: false
  },
  {
    id: 'cargo-cache',
    name: 'Rust Cargo Cache',
    category: '开发者',
    paths: [
      '%USERPROFILE%\\.cargo\\registry'
    ],
    filePatterns: ['*'],
    maxDepth: 5,
    recoverable: false
  },
  {
    id: 'go-mod-cache',
    name: 'Go Module Cache',
    category: '开发者',
    paths: [
      '%USERPROFILE%\\go\\pkg\\mod'
    ],
    filePatterns: ['*'],
    maxDepth: 8,
    recoverable: false
  }
]

export function getScannerConfigs(ids: string[], includeDeveloper: boolean): ScannerConfig[] {
  return SCANNER_CONFIGS.filter(config => {
    const isDeveloper = config.category === '开发者'
    if (isDeveloper && !includeDeveloper) return false
    return ids.includes(config.id)
  })
}

export function resolvePath(raw: string): string {
  return raw
    .replace(/%TEMP%/gi, process.env.TEMP || '')
    .replace(/%LOCALAPPDATA%/gi, process.env.LOCALAPPDATA || '')
    .replace(/%APPDATA%/gi, process.env.APPDATA || '')
    .replace(/%USERPROFILE%/gi, process.env.USERPROFILE || '')
    .replace(/%DOCUMENTS%/gi, `${process.env.USERPROFILE}\\Documents`)
    .replace(/%WINDIR%/gi, process.env.WINDIR || 'C:\\Windows')
}