<script setup lang="ts">
import { computed } from 'vue'
import { certifications } from '../data/demo'
import { useLoanStore } from '../stores/loan'
import PageNav from '../components/PageNav.vue'
const store=useLoanStore(),total=certifications.length
const progress=computed(()=>Math.round(store.completed.length/total*100))
const target=(key:string)=>['iou','income','debt'].includes(key)?`/materials/${key}`:key==='identity'?'/identity':key==='face'?'/face-auth':`/profile-auth/${key}`
</script>
<template><main class="page"><PageNav title="申请资料"/><section class="auth-summary"><span>资料完成度</span><strong>{{store.completed.length}} / {{total}}</strong><van-progress :percentage="progress" :show-pivot="false" color="#14b8a6"/><p>{{progress===100?'资料已完善，可以提交借款申请':'请逐项填写并提交真实申请资料'}}</p></section><section class="stage-list"><van-cell v-for="(item,index) in certifications" :key="item.key" :to="target(item.key)" :title="item.title" :label="item.desc" :class="['stage-item',{current:!store.completed.includes(item.key)}]" clickable><template #icon><div class="stage-index"><van-icon v-if="store.completed.includes(item.key)" name="success"/><span v-else>{{index+1}}</span></div></template><template #value><van-tag v-if="store.completed.includes(item.key)" type="success" plain>已完成</van-tag><span v-else class="stage-action">去完善 <van-icon name="arrow"/></span></template></van-cell></section><BottomActionBar><van-button round block type="primary" :disabled="progress<100" to="/loan">发起借款申请</van-button></BottomActionBar></main></template>
