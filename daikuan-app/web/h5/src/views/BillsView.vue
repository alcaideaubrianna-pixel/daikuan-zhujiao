<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import BillCard from '../components/BillCard.vue'
import AppTabbar from '../components/AppTabbar.vue'
import { useLoanStore } from '../stores/loan'
import { money } from '../data/demo'
const store=useLoanStore(),active=ref('all'),refreshing=ref(false)
const reviewing=computed(()=>store.applications.filter(item=>['manual','phone','funding'].includes(item.status)))
const approved=computed(()=>store.applications.filter(item=>item.status==='approved'))
const closed=computed(()=>store.applications.filter(item=>['rejected','cancelled'].includes(item.status)))
const current=computed(()=>active.value==='reviewing'?reviewing.value:active.value==='approved'?approved.value:active.value==='closed'?closed.value:store.applications)
const approvedAmount=computed(()=>approved.value.reduce((sum,item)=>sum+Number(item.amount),0))
async function refresh(){refreshing.value=true;try{await store.hydrate()}finally{refreshing.value=false}}
onMounted(refresh)
</script>
<template><main class="page bills-page"><van-nav-bar title="我的借款" fixed placeholder safe-area-inset-top/><section class="bills-overview"><span>累计审核通过</span><strong>{{money(approvedAmount)}}</strong><div><p><b>{{reviewing.length}}</b><small>审核中</small></p><p><b>{{approved.length}}</b><small>已通过</small></p><p><b>{{store.applications.length}}</b><small>全部申请</small></p></div></section><nav class="record-tabs"><button v-for="item in [{v:'all',l:'全部'},{v:'reviewing',l:'审核中'},{v:'approved',l:'已通过'},{v:'closed',l:'未通过'}]" :key="item.v" type="button" :class="{active:active===item.v}" @click="active=item.v">{{item.l}}</button></nav><van-pull-refresh v-model="refreshing" @refresh="refresh"><section v-if="current.length" class="loan-record-list"><BillCard v-for="item in current" :key="item.id" :bill="item"/></section><van-empty v-else description="暂无相关申请"><van-button size="small" type="primary" to="/loan">申请借款</van-button></van-empty></van-pull-refresh><AppTabbar/></main></template>
