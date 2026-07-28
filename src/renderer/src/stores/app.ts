import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { AppSettings, DiskInfo } from '../../../shared/types'

export const useAppStore = defineStore('app', () => {
  const settings = ref<AppSettings>({
    theme: 'dark',
    aiConfig: {
      baseUrl: 'https://api.openai.com/v1',
      apiKey: '',
      model: 'gpt-4o'
    },
    restoreRetentionDays: 7,
    developerMode: false,
    defaultScanItems: []
  })

  const diskInfo = ref<DiskInfo | null>(null)
  const isLoading = ref(false)

  async function init() {
    try {
      const saved = await window.electronAPI.settings.get()
      if (saved) {
        settings.value = saved
      }
      applyTheme(settings.value.theme)
    } catch {
      // Settings may not be available in dev without Electron
    }
    await refreshDiskInfo()
  }

  async function refreshDiskInfo() {
    try {
      diskInfo.value = await window.electronAPI.disk.getInfo()
    } catch {
      diskInfo.value = null
    }
  }

  async function updateSetting<K extends keyof AppSettings>(key: K, value: AppSettings[K]) {
    settings.value[key] = value
    try {
      await window.electronAPI.settings.set(key, value)
    } catch {
      // Electron API not available
    }
  }

  function applyTheme(theme: string) {
    const resolved = theme === 'system' ? getSystemTheme() : theme
    document.documentElement.classList.toggle('dark', resolved === 'dark')
  }

  function getSystemTheme(): 'light' | 'dark' {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  watch(
    () => settings.value.theme,
    theme => applyTheme(theme)
  )

  return {
    settings,
    diskInfo,
    isLoading,
    init,
    refreshDiskInfo,
    updateSetting,
    applyTheme
  }
})
