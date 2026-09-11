<script setup lang="ts">
import { computed } from 'vue'
import { certifications } from '../data/demo'
import { useLoanStore } from '../stores/loan'
import PageNav from '../components/PageNav.vue'
const store=useLoanStore(),total=certifications.length
const progress=computed(()=>Math.round(store.completed.length/total*100))
const currentIndex=computed(()=>certifications.findIndex(item=>!store.completed.includes(item.key)))
const visibleItems=computed(()=>certifications.slice(0,currentIndex.value<0?total:currentIndex.value+1))
const target=(key:string)=>key==='identity'?'/identity':key==='face'?'/face-auth':`/profile-auth/${key}`
</script>
<template><main class="page"><PageNav title="额度认证"/><section class="auth-summary"><span>认证进度</span><strong>{{store.completed.length}} / {{total}}</strong><van-progress :percentage="progress" :show-pivot="false" color="#14b8a6"/><p>{{progress===100?'认证资料已完善，可以查看模拟额度':'完成当前阶段后将开启下一项认证'}}</p></section><section class="stage-list"><article v-for="(item,index) in visibleItems" :key="item.key" :class="['stage-item',{current:!store.completed.includes(item.key)}]"><div class="stage-index"><van-icon v-if="store.completed.includes(item.key)" name="success"/><span v-else>{{index+1}}</span></div><div class="stage-copy"><b>{{item.title}}</b><span>{{item.desc}}</span></div><van-tag v-if="store.completed.includes(item.key)" type="success" plain>已完成</van-tag><van-button v-else size="small" round type="primary" :to="target(item.key)">去认证</van-button></article><div v-if="currentIndex>=0" class="locked-stage"><van-icon name="lock"/> 完成当前阶段后开启后续 {{total-visibleItems.length}} 项</div></section><van-button class="fixed-cta" round block type="primary" :disabled="progress<100" to="/credit-result">查看我的额度</van-button></main></template>
