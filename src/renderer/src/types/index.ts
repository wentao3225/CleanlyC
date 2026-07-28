export type ScanStatus = 'idle' | 'scanning' | 'analyzing' | 'completed' | 'error'

export interface PreviewFile {
  path: string
  name: string
  size: number
  type: string
  modifiedAt: number
  selected: boolean
}
