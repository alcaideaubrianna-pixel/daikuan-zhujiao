<script setup lang="ts">
import { computed } from 'vue'
import { certifications } from '../data/demo'
import { useLoanStore } from '../stores/loan'
import PageNav from '../components/PageNav.vue'
const store=useLoanStore(),total=certifications.length
const progress=computed(()=>Math.round(store.completed.length/total*100))
const target=(key:string)=>['iou','income','debt'].includes(key)?`/materials/${key}`:key==='identity'?'/identity':key==='face'?'/face-auth':`/profile-auth/${key}`
</script>
<template><main class="page"><PageNav title="额度认证"/><section class="auth-summary"><span>认证进度</span><strong>{{store.completed.length}} / {{total}}</strong><van-progress :percentage="progress" :show-pivot="false" color="#14b8a6"/><p>{{progress===100?'认证资料已完善，可以查看模拟额度':'请选择项目完善资料，全部完成后即可查看模拟额度'}}</p></section><section class="stage-list"><van-cell v-for="(item,index) in certifications" :key="item.key" :to="target(item.key)" :title="item.title" :label="item.desc" :class="['stage-item',{current:!store.completed.includes(item.key)}]" clickable><template #icon><div class="stage-index"><van-icon v-if="store.completed.includes(item.key)" name="success"/><span v-else>{{index+1}}</span></div></template><template #value><van-tag v-if="store.completed.includes(item.key)" type="success" plain>已完成</van-tag><span v-else class="stage-action">去认证 <van-icon name="arrow"/></span></template></van-cell></section><BottomActionBar><van-button round block type="primary" :disabled="progress<100" to="/credit-result">查看我的额度</van-button></BottomActionBar></main></template>
