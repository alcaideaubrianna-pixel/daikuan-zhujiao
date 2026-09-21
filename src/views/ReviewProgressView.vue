<script setup lang="ts">
import { computed, ref } from 'vue'
import { showToast } from 'vant'
import PageNav from '../components/PageNav.vue'
import { useLoanStore } from '../stores/loan'
const store=useLoanStore(),loading=ref(false),order=['manual','phone','funding','approved']
const active=computed(()=>Math.min(order.indexOf(store.reviewStage),2))
const title=computed(()=>({manual:'人工审核中',phone:'等待电话审核',funding:'市场配资中',approved:'审核已通过'}[store.reviewStage]))
const refresh=async()=>{loading.value=true;try{await store.hydrate();showToast('进度已更新')}catch(error){showToast(error instanceof Error?error.message:'更新失败')}finally{loading.value=false}}
</script>
<template><main class="page"><PageNav title="借款进度"/><section class="review-hero"><van-icon :name="store.reviewStage==='approved'?'passed':'clock-o'"/><h1>{{title}}</h1><p>申请编号 {{store.applicationId}}</p></section><van-steps direction="vertical" :active="active" active-color="#2563eb"><van-step><h3>人工资料审核</h3><p>{{store.reviewStage==='manual'?'专员正在核验申请材料':'资料审核已通过'}}</p></van-step><van-step><h3>电话审核</h3><p>{{store.reviewStage==='manual'?'等待人工审核完成':store.reviewStage==='phone'?'请留意审核来电':'电话审核已完成'}}</p></van-step><van-step><h3>市场配资与放款</h3><p>{{store.reviewStage==='funding'?'正在匹配资金方案':store.reviewStage==='approved'?'已匹配资金方案，请联系专员预约放款':'等待前序审核完成'}}</p></van-step></van-steps><van-cell-group inset><van-cell title="申请金额" :value="`¥${store.loanDraft.amount.toLocaleString()}`"/><van-cell v-if="store.reviewStage==='funding'||store.reviewStage==='approved'" title="打款详情" value="查看凭证" is-link to="/funding-detail"/><van-cell class="customer-service-cell" title="联系借款专员" label="工作时间 09:30-19:30" value="立即咨询" icon="service-o" is-link to="/support"/></van-cell-group><BottomActionBar><van-button round block type="primary" :loading="loading" @click="refresh">刷新审核进度</van-button></BottomActionBar></main></template>
