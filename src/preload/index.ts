import { contextBridge, ipcRenderer } from 'electron'
import type { AppSettings, DiskInfo } from '../shared/types'

const electronAPI = {
  window: {
    minimize: () => ipcRenderer.invoke('window:minimize'),
    maximize: () => ipcRenderer.invoke('window:maximize'),
    close: () => ipcRenderer.invoke('window:close'),
    isMaximized: () => ipcRenderer.invoke('window:isMaximized')
  },
  settings: {
    get: () => ipcRenderer.invoke('settings:getAll') as Promise<AppSettings>,
    set: (key: string, value: unknown) => ipcRenderer.invoke('settings:set', key, value)
  },
  disk: {
    getInfo: () => ipcRenderer.invoke('disk:info') as Promise<DiskInfo>
  }
}

contextBridge.exposeInMainWorld('electronAPI', electronAPI)

export type ElectronAPI = typeof electronAPI
