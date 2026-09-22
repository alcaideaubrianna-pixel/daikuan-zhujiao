<script setup lang="ts">
import { useRouter } from 'vue-router'

const props = defineProps<{ title: string; right?: string; backTo?: string }>()
defineEmits<{ right: [] }>()

const router = useRouter()

function goBack() {
  if (props.backTo) {
    router.replace(props.backTo)
    return
  }
  if (window.history.state?.back) router.back()
  else router.replace('/home')
}
</script>

<template>
  <van-nav-bar :title="title" left-arrow fixed placeholder safe-area-inset-top @click-left="goBack" @click-right="$emit('right')">
    <template v-if="right" #right>{{ right }}</template>
  </van-nav-bar>
</template>
