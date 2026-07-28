<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()
appStore.init()
</script>

<template>
  <RouterView />
</template>
