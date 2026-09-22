<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { showConfirmDialog, showToast } from 'vant'
import { api, type UserBankCard } from '../api/client'
import PageNav from '../components/PageNav.vue'
const cards=ref<UserBankCard[]>([]),loading=ref(true),saving=ref<number>()
onMounted(load)
async function load(){loading.value=true;try{cards.value=await api.bankCards()}catch(error){showToast(error instanceof Error?error.message:'银行卡加载失败')}finally{loading.value=false}}
async function setDefault(card:UserBankCard){if(card.isDefault)return;saving.value=card.id;try{await api.setDefaultBankCard(card.id);await load();showToast('默认银行卡已更新')}finally{saving.value=undefined}}
async function remove(card:UserBankCard){try{await showConfirmDialog({title:'解绑银行卡',message:`确定解除${card.bankName}（尾号 ${card.lastFour}）吗？`});await api.removeBankCard(card.id);await load();showToast('已解绑银行卡')}catch{}}
</script>
<template><main class="page bank-cards-page"><PageNav title="我的银行卡"/><van-loading v-if="loading" class="page-loading" vertical>加载中</van-loading><template v-else><section v-if="cards.length" class="user-card-list"><article v-for="card in cards" :key="card.id" class="user-bank-card"><header><span><van-icon name="card"/></span><div><b>{{card.bankName}}</b><small>借记卡</small></div><em v-if="card.isDefault">默认卡</em></header><strong>{{card.cardNo}}</strong><footer><button type="button" :disabled="Boolean(card.isDefault)||saving===card.id" @click="setDefault(card)">{{card.isDefault?'当前收款卡':'设为默认'}}</button><button type="button" @click="remove(card)">解绑</button></footer></article></section><van-empty v-else description="暂未绑定银行卡"/><div class="bank-card-security"><van-icon name="shield-o"/>银行卡信息经加密处理，仅用于收款与还款</div><BottomActionBar><van-button block type="primary" icon="plus" to="/profile-auth/bank">添加本人银行卡</van-button></BottomActionBar></template></main></template>
