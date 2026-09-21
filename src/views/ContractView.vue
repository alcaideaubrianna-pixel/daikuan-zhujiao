<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { money } from '../data/demo'
import { useLoanStore } from '../stores/loan'
import { api } from '../api/client'
import PageNav from '../components/PageNav.vue'
const store=useLoanStore(),router=useRouter(),agreed=ref(false),loading=ref(false)
const submit=async()=>{if(!agreed.value)return showToast('请阅读并同意相关协议');if(!store.applicationDbId)return showToast('请先确认借款信息');loading.value=true;try{await api.submitApplication(store.applicationDbId);store.reviewStage='manual';router.replace('/review-progress')}catch(error){showToast(error instanceof Error?error.message:'提交失败')}finally{loading.value=false}}
</script>
<template><main class="page"><PageNav title="确认借款"/><section class="contract-summary"><p>到账金额</p><strong>{{money(store.loanDraft.amount)}}</strong><span>审核通过后按约定放款</span></section><van-cell-group inset><van-cell title="借款期数" :value="`${store.loanDraft.term} 期`"/><van-cell title="收款银行卡" :value="store.loanDraft.bank"/><van-cell title="还款方式" value="按期等额还款"/><van-cell title="提前还款" value="无额外手续费"/></van-cell-group><section class="agreement-list"><h2>请阅读并确认</h2><van-cell title="《个人借款合同》" is-link/><van-cell title="《征信查询授权书》" is-link/><van-cell title="《个人信息使用授权书》" is-link/><van-checkbox v-model="agreed" shape="square">我已阅读并同意上述协议，确认借款信息无误</van-checkbox></section><BottomActionBar><van-button round block type="primary" :loading="loading" @click="submit">同意协议并提交申请</van-button></BottomActionBar></main></template>
