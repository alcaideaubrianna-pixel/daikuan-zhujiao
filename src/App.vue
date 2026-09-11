<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <van-config-provider theme="light">
    <div class="app-shell">
      <router-view v-slot="{ Component }">
        <transition :name="(route.meta.transition as string) || 'page-slide'" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
    </div>
  </van-config-provider>
</template>
