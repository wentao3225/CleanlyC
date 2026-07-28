<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'
import {
  LayoutDashboard,
  RotateCcw,
  Settings,
  Sun,
  Moon,
  Sparkles
} from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()

const navItems = [
  { path: '/', name: 'dashboard', label: '概览', icon: LayoutDashboard },
  { path: '/recovery', name: 'recovery', label: '恢复中心', icon: RotateCcw },
  { path: '/settings', name: 'settings', label: '设置', icon: Settings }
]

function navigate(path: string) {
  router.push(path)
}

function isActive(name: string) {
  return route.name === name || (route.path === '/' && name === 'dashboard')
}

function toggleTheme() {
  const next = appStore.settings.theme === 'dark' ? 'light' : 'dark'
  appStore.updateSetting('theme', next)
}

const isDark = computed(() => appStore.settings.theme === 'dark')
</script>

<template>
  <aside
    class="flex flex-col select-none shrink-0"
    style="
      width: var(--sidebar-width);
      background-color: var(--color-surface);
      border-right: 1px solid var(--color-border);
    "
  >
    <div class="flex items-center gap-2.5 px-5 pt-6 pb-5" style="height: 48px">
      <div
        class="flex items-center justify-center w-8 h-8 rounded-lg"
        style="background: linear-gradient(135deg, var(--color-accent), #8b5cf6)"
      >
        <Sparkles :size="18" color="white" />
      </div>
      <span class="text-base font-semibold tracking-tight" style="color: var(--color-text-primary)">
        CleanlyC
      </span>
    </div>

    <nav class="flex-1 px-3 py-2 space-y-1">
      <button
        v-for="item in navItems"
        :key="item.name"
        @click="navigate(item.path)"
        :class="isActive(item.name) ? 'nav-item-active' : 'nav-item-inactive'"
      >
        <component :is="item.icon" :size="18" />
        <span>{{ item.label }}</span>
      </button>
    </nav>

    <div class="px-3 py-4 border-t" style="border-color: var(--color-border)">
      <button class="nav-item-inactive w-full" @click="toggleTheme">
        <component :is="isDark ? Sun : Moon" :size="18" />
        <span>{{ isDark ? '浅色模式' : '深色模式' }}</span>
      </button>
    </div>

    <div class="px-4 py-3" style="border-top: 1px solid var(--color-border)">
      <p class="text-xs" style="color: var(--color-text-tertiary)">CleanlyC v1.0.0</p>
    </div>
  </aside>
</template>
