import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'

import './styles/tailwind.css'
import './styles/index.css'

async function bootstrap() {
  if (window.electronAPI) {
    try {
      const settings = await window.electronAPI.settings.get()
      const theme = settings.theme === 'system'
        ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        : settings.theme
      document.documentElement.classList.toggle('dark', theme === 'dark')
    } catch {
      document.documentElement.classList.add('dark')
    }
  } else {
    document.documentElement.classList.add('dark')
  }

  const app = createApp(App)
  app.use(createPinia())
  app.use(router)
  app.mount('#app')
}

bootstrap()
