<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAppStore } from '@/stores/app'
import {
  Settings,
  Palette,
  Sun,
  Moon,
  Monitor,
  Key,
  Globe,
  Cpu,
  Code2,
  Clock,
  Info,
  ExternalLink,
  Eye,
  EyeOff,
  Check
} from 'lucide-vue-next'

const appStore = useAppStore()
const apiKeyVisible = ref(false)
const savedToast = ref(false)

const themeOptions = [
  { value: 'light' as const, label: '浅色', icon: Sun },
  { value: 'dark' as const, label: '深色', icon: Moon },
  { value: 'system' as const, label: '跟随系统', icon: Monitor }
]

const retentionOptions = [
  { value: 7 as const, label: '7 天' },
  { value: 14 as const, label: '14 天' },
  { value: 30 as const, label: '30 天' },
  { value: -1 as const, label: '永久' }
]

async function setTheme(theme: 'light' | 'dark' | 'system') {
  await appStore.updateSetting('theme', theme)
}

async function setRetention(days: 7 | 14 | 30 | -1) {
  await appStore.updateSetting('restoreRetentionDays', days)
}

async function toggleDeveloperMode() {
  await appStore.updateSetting('developerMode', !appStore.settings.developerMode)
}

async function saveAIConfig() {
  await appStore.updateSetting('aiConfig', { ...appStore.settings.aiConfig })
  savedToast.value = true
  setTimeout(() => {
    savedToast.value = false
  }, 2000)
}

const baseUrl = computed({
  get: () => appStore.settings.aiConfig.baseUrl,
  set: (val: string) => {
    appStore.settings.aiConfig.baseUrl = val
  }
})

const apiKey = computed({
  get: () => appStore.settings.aiConfig.apiKey,
  set: (val: string) => {
    appStore.settings.aiConfig.apiKey = val
  }
})

const model = computed({
  get: () => appStore.settings.aiConfig.model,
  set: (val: string) => {
    appStore.settings.aiConfig.model = val
  }
})
</script>

<template>
  <div class="max-w-2xl space-y-8">
    <div>
      <h2 class="text-2xl font-semibold mb-1">设置</h2>
      <p class="text-sm" style="color: var(--color-text-secondary)">
        自定义 CleanlyC 的行为与外观
      </p>
    </div>

    <!-- Theme -->
    <section class="glass card p-6">
      <div class="flex items-center gap-3 mb-4">
        <Palette :size="18" style="color: var(--color-accent)" />
        <h3 class="text-base font-semibold">主题</h3>
      </div>
      <div class="grid grid-cols-3 gap-3">
        <button
          v-for="opt in themeOptions"
          :key="opt.value"
          class="flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-200"
          :class="appStore.settings.theme === opt.value
            ? 'border-blue-500/50 bg-blue-500/5'
            : 'hover:bg-black/3 dark:hover:bg-white/3'"
          :style="{ borderColor: appStore.settings.theme === opt.value ? '' : 'var(--color-border)' }"
          @click="setTheme(opt.value)"
        >
          <component :is="opt.icon" :size="20" :style="{
            color: appStore.settings.theme === opt.value ? 'var(--color-accent)' : 'var(--color-text-secondary)'
          }" />
          <span class="text-xs font-medium" style="color: var(--color-text-secondary)">{{ opt.label }}</span>
        </button>
      </div>
    </section>

    <!-- AI Config -->
    <section class="glass card p-6">
      <div class="flex items-center gap-3 mb-4">
        <Cpu :size="18" style="color: var(--color-accent)" />
        <h3 class="text-base font-semibold">AI 配置</h3>
      </div>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-2" style="color: var(--color-text-secondary)">
            <Globe :size="13" class="inline mr-1" />
            Base URL
          </label>
          <input
            v-model="baseUrl"
            type="text"
            placeholder="https://api.openai.com/v1"
            class="w-full px-4 py-2.5 text-sm rounded-xl border outline-none transition-all duration-200 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10"
            :style="{
              backgroundColor: 'var(--color-bg)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-primary)'
            }"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-2" style="color: var(--color-text-secondary)">
            <Key :size="13" class="inline mr-1" />
            API Key
          </label>
          <div class="relative">
            <input
              v-model="apiKey"
              :type="apiKeyVisible ? 'text' : 'password'"
              placeholder="sk-xxxxxxxx"
              class="w-full px-4 py-2.5 pr-12 text-sm rounded-xl border outline-none transition-all duration-200 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10"
              :style="{
                backgroundColor: 'var(--color-bg)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-primary)'
              }"
            />
            <button
              class="absolute right-3 top-1/2 -translate-y-1/2"
              style="color: var(--color-text-tertiary)"
              @click="apiKeyVisible = !apiKeyVisible"
            >
              <Eye v-if="!apiKeyVisible" :size="16" />
              <EyeOff v-else :size="16" />
            </button>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium mb-2" style="color: var(--color-text-secondary)">
            模型名称
          </label>
          <input
            v-model="model"
            type="text"
            placeholder="gpt-4o"
            class="w-full px-4 py-2.5 text-sm rounded-xl border outline-none transition-all duration-200 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10"
            :style="{
              backgroundColor: 'var(--color-bg)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-primary)'
            }"
          />
        </div>
        <div class="flex items-center gap-3">
          <button class="btn-primary text-sm" @click="saveAIConfig">
            <Check :size="14" class="mr-1" />
            保存配置
          </button>
          <transition name="fade">
            <span v-if="savedToast" class="text-xs font-medium" style="color: var(--color-success)">
              已保存
            </span>
          </transition>
        </div>
      </div>
    </section>

    <!-- Developer Mode -->
    <section class="glass card p-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <Code2 :size="18" style="color: var(--color-accent)" />
          <div>
            <h3 class="text-base font-semibold">开发者模式</h3>
            <p class="text-sm" style="color: var(--color-text-tertiary)">
              显示开发者缓存扫描项 (npm, Gradle, Docker 等)
            </p>
          </div>
        </div>
        <button
          class="relative w-12 h-7 rounded-full transition-colors duration-300"
          :style="{
            backgroundColor: appStore.settings.developerMode ? 'var(--color-accent)' : 'var(--color-border)'
          }"
          @click="toggleDeveloperMode"
        >
          <div
            class="absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-sm transition-transform duration-300"
            :style="{
              transform: appStore.settings.developerMode ? 'translateX(20px)' : 'translateX(2px)'
            }"
          />
        </button>
      </div>
    </section>

    <!-- Restore Retention -->
    <section class="glass card p-6">
      <div class="flex items-center gap-3 mb-4">
        <Clock :size="18" style="color: var(--color-accent)" />
        <h3 class="text-base font-semibold">恢复保留天数</h3>
      </div>
      <div class="flex gap-3">
        <button
          v-for="opt in retentionOptions"
          :key="opt.value"
          class="px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200"
          :class="appStore.settings.restoreRetentionDays === opt.value
            ? 'border-blue-500/50 bg-blue-500/5 text-blue-600 dark:text-blue-400'
            : 'hover:bg-black/3 dark:hover:bg-white/3'"
          :style="{
            borderColor: appStore.settings.restoreRetentionDays === opt.value ? '' : 'var(--color-border)',
            color: appStore.settings.restoreRetentionDays === opt.value ? '' : 'var(--color-text-secondary)'
          }"
          @click="setRetention(opt.value)"
        >
          {{ opt.label }}
        </button>
      </div>
    </section>

    <!-- About -->
    <section class="glass card p-6">
      <div class="flex items-center gap-3 mb-4">
        <Info :size="18" style="color: var(--color-accent)" />
        <h3 class="text-base font-semibold">关于</h3>
      </div>
      <div class="space-y-2 text-sm" style="color: var(--color-text-secondary)">
        <p>CleanlyC — 基于 AI 智能分析的 Windows C 盘清理工具</p>
        <p>版本: v1.0.0</p>
        <p>技术栈: Electron + Vue3 + TypeScript</p>
        <a
          href="#"
          class="inline-flex items-center gap-1 font-medium transition-colors duration-200 hover:underline"
          style="color: var(--color-accent)"
        >
          <ExternalLink :size="13" />
          GitHub
        </a>
      </div>
    </section>
  </div>
</template>
