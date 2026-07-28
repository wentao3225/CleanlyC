<script setup lang="ts">
import { ref } from 'vue'
import type { RecoveryRecord } from '../../../shared/types'
import {
  RotateCcw,
  Trash2,
  Clock,
  FolderOpen,
  AlertCircle
} from 'lucide-vue-next'

const retentionDays = ref(7)

const formatBytes = (bytes: number): string => {
  if (!bytes) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let unitIndex = 0
  let size = bytes
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }
  return `${size.toFixed(unitIndex > 0 ? 1 : 0)} ${units[unitIndex]}`
}

const records = ref<RecoveryRecord[]>([])

const recovering = ref<string | null>(null)

function restoreRecord(record: RecoveryRecord) {
  recovering.value = record.id
  setTimeout(() => {
    recovering.value = null
  }, 1000)
}

function deletePermanently(record: RecoveryRecord) {
  records.value = records.value.filter((r: RecoveryRecord) => r.id !== record.id)
}
</script>

<template>
  <div class="max-w-3xl space-y-8">
    <div>
      <h2 class="text-2xl font-semibold mb-1">恢复中心</h2>
      <p class="text-sm" style="color: var(--color-text-secondary)">
        已删除文件默认保留 {{ retentionDays }} 天，到期后自动清除
      </p>
    </div>

    <div v-if="records.length === 0" class="glass card p-12 text-center">
      <AlertCircle :size="40" class="mx-auto mb-4" style="color: var(--color-text-tertiary)" />
      <h3 class="text-lg font-medium mb-2">暂无已删除文件</h3>
      <p class="text-sm" style="color: var(--color-text-secondary)">
        清理后的文件将显示在这里
      </p>
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="record in records"
        :key="record.id"
        class="glass card p-4 flex items-center gap-4"
      >
        <div
          class="flex items-center justify-center w-10 h-10 rounded-xl shrink-0"
          style="background-color: var(--color-surface-hover)"
        >
          <FolderOpen :size="18" style="color: var(--color-text-secondary)" />
        </div>

        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium truncate">{{ record.originalPath }}</p>
          <div class="flex items-center gap-3 mt-1">
            <span class="text-xs flex items-center gap-1" style="color: var(--color-text-tertiary)">
              <Clock :size="11" />
              {{ record.deletedAt }}
            </span>
            <span class="text-xs flex items-center gap-1" style="color: var(--color-text-tertiary)">
              {{ formatBytes(record.size) }}
            </span>
          </div>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <button
            class="btn-ghost text-sm px-3 py-1.5"
            :disabled="recovering === record.id"
            @click="restoreRecord(record)"
          >
            <RotateCcw :size="14" class="mr-1" :class="{ 'animate-spin': recovering === record.id }" />
            恢复
          </button>
          <button
            class="btn-danger text-sm px-3 py-1.5"
            @click="deletePermanently(record)"
          >
            <Trash2 :size="14" class="mr-1" />
            永久删除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
