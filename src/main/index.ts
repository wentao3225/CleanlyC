import { app, BrowserWindow, ipcMain, shell } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import Store from 'electron-store'
import type { AppSettings } from '../shared/types'

const store = new Store<AppSettings>({
  defaults: {
    theme: 'dark',
    aiConfig: {
      baseUrl: 'https://api.openai.com/v1',
      apiKey: '',
      model: 'gpt-4o'
    },
    restoreRetentionDays: 7,
    developerMode: false,
    defaultScanItems: []
  }
})

let mainWindow: BrowserWindow | null = null

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 750,
    minWidth: 900,
    minHeight: 600,
    show: false,
    frame: false,
    titleBarStyle: 'hidden',
    backgroundColor: '#0a0a0f',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
  })

  mainWindow.webContents.setWindowOpenHandler(details => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

function setupIPC(): void {
  ipcMain.handle('window:minimize', () => mainWindow?.minimize())
  ipcMain.handle('window:maximize', () => {
    if (mainWindow?.isMaximized()) {
      mainWindow.unmaximize()
    } else {
      mainWindow?.maximize()
    }
  })
  ipcMain.handle('window:close', () => mainWindow?.close())
  ipcMain.handle('window:isMaximized', () => mainWindow?.isMaximized())

  ipcMain.handle('settings:get', () => {
    return store.store
  })

  ipcMain.handle('settings:set', (_event, key: string, value: unknown) => {
    store.set(key as keyof AppSettings, value as never)
  })

  ipcMain.handle('settings:getAll', () => {
    return store.store
  })

  ipcMain.handle('settings:reset', () => {
    store.clear()
    return store.store
  })

  ipcMain.handle('disk:info', () => {
    const { execSync } = require('child_process')
    try {
      const output = execSync(
        'powershell -Command "Get-PSDrive -Name C | Select-Object Used,Free | ConvertTo-Json"',
        { encoding: 'utf-8' }
      )
      const data = JSON.parse(output)
      const free = data.Free || 0
      const used = data.Used || 0
      const total = free + used
      return {
        total,
        used,
        free,
        percentUsed: total > 0 ? Math.round((used / total) * 100) : 0,
        drive: 'C:',
        fsType: 'NTFS'
      }
    } catch {
      return {
        total: 0,
        used: 0,
        free: 0,
        percentUsed: 0,
        drive: 'C:',
        fsType: ''
      }
    }
  })
}

app.whenReady().then(() => {
  setupIPC()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
