<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { showConfirmDialog } from 'vant'
import AppTabbar from '../components/AppTabbar.vue'
import { useLoanStore } from '../stores/loan'
const store=useLoanStore(),router=useRouter()
const displayName=computed(()=>store.user?.nickName||store.user?.phone||'用户')
const initial=computed(()=>displayName.value.slice(0,1))
const approvedAmount=computed(()=>store.applications.filter(item=>item.status==='approved').reduce((sum,item)=>sum+Number(item.amount),0))
const reviewingCount=computed(()=>store.applications.filter(item=>['manual','phone','funding'].includes(item.status)).length)
const logout=()=>showConfirmDialog({title:'退出登录',message:'确定退出当前账号吗？'}).then(()=>{store.logout();router.replace('/login')}).catch(()=>{})
</script>
<template><main class="page profile"><section class="profile-head"><div class="avatar avatar-lg">{{initial}}</div><div><h1>{{displayName}}</h1><p><van-icon name="certificate"/> {{store.certified?'资料已完善':'资料待完善'}}</p></div><router-link to="/messages" aria-label="消息中心"><van-icon name="bell"/></router-link></section><section class="profile-stats"><router-link to="/auth"><strong>{{store.completed.length}} / 8</strong><span>资料进度</span></router-link><router-link to="/bills"><strong>¥{{approvedAmount.toLocaleString()}}</strong><span>审核通过</span></router-link><router-link to="/review-progress"><strong>{{reviewingCount}} 笔</strong><span>审核中</span></router-link></section><van-cell-group inset><van-cell title="认证资料" icon="records-o" :value="store.certified?'已完成':'待完善'" is-link to="/auth"/><van-cell title="我的银行卡" icon="card" is-link to="/bank-cards"/><van-cell title="申请记录" icon="description-o" :value="`${store.applications.length} 笔`" is-link to="/bills"/><van-cell title="消息中心" icon="chat-o" is-link to="/messages"/></van-cell-group><van-cell-group inset><van-cell class="customer-service-cell" title="在线客服" label="工作时间 09:30-19:30" value="立即咨询" icon="service-o" is-link to="/support"/><van-cell title="隐私政策" icon="shield-o" is-link to="/content/privacy"/><van-cell title="关于快贷" icon="info-o" value="V1.0" is-link to="/content/about"/></van-cell-group><van-button class="logout-button" block @click="logout">退出登录</van-button><AppTabbar/></main></template>
