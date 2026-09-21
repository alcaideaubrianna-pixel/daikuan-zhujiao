<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { showConfirmDialog } from 'vant'
import AppTabbar from '../components/AppTabbar.vue'
import PrototypeNotice from '../components/PrototypeNotice.vue'
import { useLoanStore } from '../stores/loan'
const store=useLoanStore(),router=useRouter()
const displayName=computed(()=>store.user?.nickName||store.user?.phone||'用户')
const initial=computed(()=>displayName.value.slice(0,1))
const logout=()=>showConfirmDialog({title:'退出登录',message:'确定退出当前账号吗？'}).then(()=>{store.logout();router.replace('/login')}).catch(()=>{})
</script>
<template><main class="page profile"><section class="profile-head"><div class="avatar avatar-lg">{{initial}}</div><div><h1>{{displayName}}</h1><p><van-icon name="certificate"/> {{store.certified?'资料已完善':'资料待完善'}}</p></div><router-link to="/messages"><van-icon name="bell" badge="2"/></router-link></section><section class="profile-stats"><router-link to="/credit-result"><strong>¥20,000</strong><span>总额度</span></router-link><router-link to="/bills"><strong>¥10,000</strong><span>待还本金</span></router-link><router-link to="/bills"><strong>4 期</strong><span>剩余账单</span></router-link></section><PrototypeNotice/><van-cell-group inset><van-cell title="认证资料" icon="records-o" :value="store.certified?'已完成':'待完善'" is-link to="/auth"/><van-cell title="我的银行卡" icon="card" is-link to="/profile-auth/bank"/><van-cell title="借款合同" icon="description-o" is-link/><van-cell title="消息中心" icon="chat-o" badge="2" is-link to="/messages"/></van-cell-group><van-cell-group inset><van-cell class="customer-service-cell" title="在线客服" label="工作时间 09:30-19:30" value="立即咨询" icon="service-o" is-link to="/support"/><van-cell title="协议与隐私" icon="shield-o" is-link/><van-cell title="关于快贷" icon="info-o" value="V1.0" is-link/></van-cell-group><van-button class="logout-button" block @click="logout">退出登录</van-button><AppTabbar/></main></template>
