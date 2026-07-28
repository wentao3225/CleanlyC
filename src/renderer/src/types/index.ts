export interface ScanCategory {
  id: string
  name: string
  icon: string
  group: 'system' | 'browser' | 'software' | 'files' | 'developer'
  enabled: boolean
}

export type ScanStatus = 'idle' | 'scanning' | 'analyzing' | 'completed' | 'error'

export interface PreviewFile {
  path: string
  name: string
  size: number
  type: string
  modifiedAt: number
  selected: boolean
}
