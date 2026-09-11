<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useLoanStore } from '../stores/loan'
import PageNav from '../components/PageNav.vue'
const scanning=ref(false),success=ref(false),router=useRouter(),store=useLoanStore()
const scan=()=>{scanning.value=true;setTimeout(()=>{scanning.value=false;success.value=true;store.complete('face')},1500)}
const next=()=>router.replace('/auth')
</script>
<template><main class="face-page"><PageNav title="人脸核身"/><div class="face-copy"><h1>{{success?'核身通过':'请正对屏幕'}}</h1><p>{{success?'已确认由本人完成当前操作':'保持光线充足，请勿佩戴帽子或口罩'}}</p></div><div :class="['face-frame',{scanning,success}]"><van-icon v-if="success" name="success"/><van-icon v-else name="manager-o"/><i v-if="scanning"/></div><div v-if="scanning" class="scan-status"><van-loading size="18" color="#2563eb"/> 正在检测，请保持不动</div><van-steps v-else-if="!success" :active="0"><van-step>正对屏幕</van-step><van-step>眨眨眼睛</van-step><van-step>完成核验</van-step></van-steps><van-button class="fixed-cta" round block type="primary" :loading="scanning" @click="success?next():scan()">{{success?'完成并继续':'开始人脸核身'}}</van-button><p class="face-disclaimer">人脸画面仅为原型模拟，不会调用摄像头或采集生物信息</p></main></template>
