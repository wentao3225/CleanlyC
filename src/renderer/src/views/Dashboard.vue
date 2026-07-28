<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAppStore } from '@/stores/app'
import { useScanStore } from '@/stores/scan'
import {
  HardDrive,
  ScanLine,
  Database,
  Square,
  AlertCircle,
  Ban
} from 'lucide-vue-next'

const appStore = useAppStore()
const scanStore = useScanStore()

const systemItems = ref([
  { id: 'windows-temp', label: 'Windows Temp', enabled: true },
  { id: 'windows-update-cache', label: 'Windows Update Cache', enabled: true },
  { id: 'recycle-bin', label: '回收站', enabled: true },
  { id: 'windows-logs', label: 'Windows 日志', enabled: true },
  { id: 'thumbnail-cache', label: '缩略图缓存', enabled: true },
  { id: 'prefetch', label: 'Prefetch', enabled: true },
  { id: 'softwaredistribution', label: 'SoftwareDistribution', enabled: true }
])

const browserItems = ref([
  { id: 'chrome-cache', label: 'Chrome Cache', enabled: true },
  { id: 'edge-cache', label: 'Edge Cache', enabled: true },
  { id: 'firefox-cache', label: 'Firefox Cache', enabled: true }
])

const softwareItems = ref([
  { id: 'wechat-cache', label: '微信缓存', enabled: true },
  { id: 'qq-cache', label: 'QQ 缓存', enabled: true }
])

const fileItems = ref([
  { id: 'empty-folders', label: '空文件夹', enabled: true },
  { id: 'large-files', label: '大文件', enabled: true },
  { id: 'log-files', label: '日志文件', enabled: true }
])

const devItems = ref([
  { id: 'npm-cache', label: 'npm Cache', enabled: true },
  { id: 'pnpm-store', label: 'pnpm Store', enabled: true },
  { id: 'yarn-cache', label: 'Yarn Cache', enabled: true },
  { id: 'maven-repo', label: 'Maven Repository', enabled: true },
  { id: 'gradle-cache', label: 'Gradle Cache', enabled: true },
  { id: 'docker-cache', label: 'Docker Cache', enabled: true },
  { id: 'android-studio-cache', label: 'Android Studio Cache', enabled: true },
  { id: 'intellij-cache', label: 'IntelliJ IDEA Cache', enabled: true },
  { id: 'vscode-cache', label: 'VSCode Cache', enabled: true },
  { id: 'node-cache', label: 'Node Cache', enabled: true },
  { id: 'pip-cache', label: 'Python pip Cache', enabled: true },
  { id: 'cargo-cache', label: 'Rust Cargo Cache', enabled: true },
  { id: 'go-mod-cache', label: 'Go Module Cache', enabled: true }
])

const showDevItems = computed(() => appStore.settings.developerMode)

const diskPercent = computed(() => {
  if (!appStore.diskInfo) return 0
  return appStore.diskInfo.percentUsed
})

const formatBytes = (bytes: number): string => {
  if (!bytes) return '—'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let unitIndex = 0
  let size = bytes
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }
  return `${size.toFixed(unitIndex > 0 ? 1 : 0)} ${units[unitIndex]}`
}

const usedSpace = computed(() => {
  return appStore.diskInfo ? formatBytes(appStore.diskInfo.used) : '—'
})

const freeSpace = computed(() => {
  return appStore.diskInfo ? formatBytes(appStore.diskInfo.free) : '—'
})

const totalSpace = computed(() => {
  return appStore.diskInfo ? formatBytes(appStore.diskInfo.total) : '—'
})

function startScan() {
  const enabledIds = scanCategoryGroups.value.flatMap(g =>
    g.items.filter(item => item.enabled).map(item => item.id)
  )
  scanStore.startScan({
    items: enabledIds,
    developerMode: appStore.settings.developerMode
  })
}

function abortScan() {
  scanStore.abortScan()
}

const scanCategoryGroups = computed(() => {
  const items: { id: string; label: string; items: typeof systemItems.value }[] = [
    { id: 'system', label: '系统', items: systemItems.value },
    { id: 'browser', label: '浏览器', items: browserItems.value },
    { id: 'software', label: '软件', items: softwareItems.value },
    { id: 'files', label: '文件', items: fileItems.value }
  ]
  if (showDevItems.value) {
    items.push({ id: 'developer', label: '开发者', items: devItems.value })
  }
  return items
})

const allChecked = computed(() => {
  const all = scanCategoryGroups.value.flatMap(g => g.items)
  return all.length > 0 && all.every(item => item.enabled)
})

const totalChecked = computed(() => {
  const all = scanCategoryGroups.value.flatMap(g => g.items)
  return all.filter(item => item.enabled).length
})

function toggleAll() {
  const newVal = !allChecked.value
  scanCategoryGroups.value.forEach(g => {
    g.items.forEach(item => {
      item.enabled = newVal
    })
  })
}

function toggleCategory(catId: string) {
  const group = scanCategoryGroups.value.find(g => g.id === catId)
  if (!group) return
  const allEnabled = group.items.every(item => item.enabled)
  group.items.forEach(item => {
    item.enabled = !allEnabled
  })
}
</script>

<template>
  <div class="space-y-8">
    <!-- Disk Info Card -->
    <div class="glass card p-6">
      <div class="flex items-center gap-3 mb-5">
        <HardDrive :size="20" style="color: var(--color-accent)" />
        <h2 class="text-lg font-semibold">C 盘空间</h2>
      </div>

      <div class="flex items-center gap-8">
        <div class="relative w-24 h-24">
          <svg class="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50" cy="50" r="42"
              fill="none"
              :stroke="`var(--color-border)`"
              stroke-width="8"
            />
            <circle
              cx="50" cy="50" r="42"
              fill="none"
              :stroke="`var(--color-accent)`"
              stroke-width="8"
              stroke-linecap="round"
              :stroke-dasharray="`${diskPercent * 2.64} 264`"
              class="transition-all duration-700 ease-out"
            />
          </svg>
          <div class="absolute inset-0 flex flex-col items-center justify-center">
            <span class="text-xl font-bold" style="color: var(--color-accent)">{{ diskPercent }}%</span>
            <span class="text-xs" style="color: var(--color-text-tertiary)">已用</span>
          </div>
        </div>
        <div class="flex-1 space-y-3">
          <div>
            <div class="flex justify-between text-sm mb-1">
              <span style="color: var(--color-text-secondary)">已使用</span>
              <span class="font-medium">{{ usedSpace }}</span>
            </div>
            <div class="flex justify-between text-sm mb-1">
              <span style="color: var(--color-text-secondary)">剩余</span>
              <span class="font-medium">{{ freeSpace }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span style="color: var(--color-text-secondary)">总容量</span>
              <span class="font-medium">{{ totalSpace }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Scan Button -->
    <div class="flex items-center gap-4">
      <button
        v-if="!scanStore.isScanning"
        class="btn-primary text-base px-8 py-3 gap-2"
        @click="startScan"
      >
        <ScanLine :size="20" />
        <span>开始扫描</span>
      </button>
      <button
        v-else
        class="btn-danger text-base px-8 py-3 gap-2"
        @click="abortScan"
      >
        <Square :size="18" />
        <span>停止扫描</span>
      </button>
      <p class="text-sm" style="color: var(--color-text-tertiary)">
        已选择 {{ totalChecked }} 个扫描项
      </p>
    </div>

    <!-- Progress Bar -->
    <div v-if="scanStore.progress" class="glass card p-4">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-medium" style="color: var(--color-text-secondary)">
          {{ scanStore.progress.currentItem }}
        </span>
        <span class="text-xs" style="color: var(--color-text-tertiary)">
          {{ scanStore.progress.current }} / {{ scanStore.progress.total }}
        </span>
      </div>
      <div class="w-full h-2 rounded-full overflow-hidden" style="background-color: var(--color-surface-hover)">
        <div
          class="h-full rounded-full transition-all duration-300 ease-out"
          :style="{
            width: scanStore.progress.total > 0
              ? `${(scanStore.progress.current / scanStore.progress.total) * 100}%`
              : '0%',
            background: 'linear-gradient(135deg, var(--color-accent), #8b5cf6)'
          }"
        />
      </div>
      <p v-if="scanStore.progress.message" class="mt-2 text-xs" style="color: var(--color-text-tertiary)">
        {{ scanStore.progress.message }}
      </p>
    </div>

    <!-- Cancelled -->
    <div v-if="scanStore.cancelled" class="glass card p-4 flex items-center gap-3" style="border-color: var(--color-warning);">
      <Ban :size="18" style="color: var(--color-warning)" />
      <span class="text-sm font-medium" style="color: var(--color-warning)">扫描已取消</span>
    </div>

    <!-- Error -->
    <div v-if="scanStore.error" class="glass card p-4 flex items-center gap-3" style="border-color: var(--color-danger);">
      <AlertCircle :size="18" style="color: var(--color-danger)" />
      <span class="text-sm" style="color: var(--color-danger)">{{ scanStore.error }}</span>
    </div>

    <!-- Scan Results Summary -->
    <div v-if="scanStore.scanItems.length > 0 && !scanStore.isScanning && !scanStore.cancelled" class="glass card p-6">
      <div class="flex items-center gap-3 mb-4">
        <Database :size="18" style="color: var(--color-accent)" />
        <h3 class="text-base font-semibold">扫描结果</h3>
      </div>
      <div class="grid grid-cols-3 gap-4">
        <div class="text-center p-4 rounded-xl" style="background-color: var(--color-surface-hover)">
          <p class="text-2xl font-bold" style="color: var(--color-accent)">{{ scanStore.formatBytes(scanStore.totalSize) }}</p>
          <p class="text-xs mt-1" style="color: var(--color-text-tertiary)">总大小</p>
        </div>
        <div class="text-center p-4 rounded-xl" style="background-color: var(--color-surface-hover)">
          <p class="text-2xl font-bold" style="color: var(--color-text-primary)">{{ scanStore.totalFiles.toLocaleString() }}</p>
          <p class="text-xs mt-1" style="color: var(--color-text-tertiary)">文件数量</p>
        </div>
        <div class="text-center p-4 rounded-xl" style="background-color: var(--color-surface-hover)">
          <p class="text-2xl font-bold" style="color: var(--color-success)">{{ scanStore.groupedItems.size }}</p>
          <p class="text-xs mt-1" style="color: var(--color-text-tertiary)">分类数量</p>
        </div>
      </div>
    </div>

    <!-- Scan Items -->
    <div>
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-base font-semibold flex items-center gap-2">
          <Database :size="18" style="color: var(--color-accent)" />
          扫描项
        </h3>
        <button
          class="text-sm font-medium transition-colors duration-200"
          style="color: var(--color-accent)"
          @click="toggleAll"
        >
          {{ allChecked ? '取消全选' : '全选' }}
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="group in scanCategoryGroups"
          :key="group.id"
          class="glass card p-5"
        >
          <div class="flex items-center justify-between mb-3">
            <h4 class="text-sm font-semibold">{{ group.label }}</h4>
            <button
              class="text-xs font-medium px-2 py-1 rounded-lg transition-colors duration-200"
              style="color: var(--color-text-secondary); background-color: var(--color-surface-hover)"
              @click="toggleCategory(group.id)"
            >
              {{ group.items.every(item => item.enabled) ? '取消' : '全选' }}
            </button>
          </div>
          <div class="space-y-1.5">
            <label
              v-for="item in group.items"
              :key="item.id"
              class="flex items-center gap-2.5 py-1.5 px-2 rounded-lg cursor-pointer transition-colors duration-150 hover:bg-black/3 dark:hover:bg-white/3"
            >
              <input
                v-model="item.enabled"
                type="checkbox"
                class="w-4 h-4 rounded accent-blue-500 cursor-pointer"
              />
              <span class="text-sm" style="color: var(--color-text-secondary)">{{ item.label }}</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
