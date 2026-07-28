<script setup lang="ts">
import { RouterView } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'
import TitleBar from '@/components/TitleBar.vue'
</script>

<template>
  <div class="flex h-screen overflow-hidden" style="background-color: var(--color-bg)">
    <Sidebar />
    <div class="flex flex-1 flex-col overflow-hidden">
      <TitleBar />
      <main class="flex-1 overflow-y-auto overflow-x-hidden px-8 py-6">
        <RouterView v-slot="{ Component }">
          <transition name="slide-up" mode="out-in">
            <component :is="Component" />
          </transition>
        </RouterView>
      </main>
    </div>
  </div>
</template>
