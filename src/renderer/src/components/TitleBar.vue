<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Minus, Maximize2, X, Square } from 'lucide-vue-next'

const isMaximized = ref(false)
let checkInterval: ReturnType<typeof setInterval> | null = null

async function checkMaximize() {
  try {
    isMaximized.value = await window.electronAPI.window.isMaximized()
  } catch {
    // Not in Electron
  }
}

onMounted(() => {
  checkMaximize()
  checkInterval = setInterval(checkMaximize, 1000)
})

onUnmounted(() => {
  if (checkInterval) clearInterval(checkInterval)
})

function minimize() {
  try {
    window.electronAPI.window.minimize()
  } catch {
    //
  }
}

function toggleMaximize() {
  try {
    window.electronAPI.window.maximize()
  } catch {
    //
  }
}

function close() {
  try {
    window.electronAPI.window.close()
  } catch {
    //
  }
}
</script>

<template>
  <header
    class="flex items-center justify-between shrink-0 px-4"
    style="height: 48px; -webkit-app-region: drag"
  >
    <div class="text-xs font-medium" style="color: var(--color-text-secondary); -webkit-app-region: no-drag">
      CleanlyC
    </div>

    <div class="flex items-center gap-1" style="-webkit-app-region: no-drag">
      <button
        class="flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-200 hover:bg-black/5 dark:hover:bg-white/5"
        style="color: var(--color-text-secondary)"
        @click="minimize"
      >
        <Minus :size="15" />
      </button>
      <button
        class="flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-200 hover:bg-black/5 dark:hover:bg-white/5"
        style="color: var(--color-text-secondary)"
        @click="toggleMaximize"
      >
        <component :is="isMaximized ? Square : Maximize2" :size="14" />
      </button>
      <button
        class="flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-200 hover:bg-red-500/15 hover:text-red-500"
        style="color: var(--color-text-secondary)"
        @click="close"
      >
        <X :size="15" />
      </button>
    </div>
  </header>
</template>
