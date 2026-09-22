<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { api, type NotificationItem } from '../api/client'
import PageNav from '../components/PageNav.vue'

const router = useRouter()
const activeType = ref('all')
const messages = ref<NotificationItem[]>([])
const unread = ref(0)
const loading = ref(false)
const filters = [{ label: '全部', value: 'all' }, { label: '审核通知', value: 'review' }, { label: '还款提醒', value: 'repayment' }, { label: '系统消息', value: 'system' }]
const iconMap: Record<string, { icon:string; tone:string }> = { review:{icon:'passed',tone:'success'},repayment:{icon:'clock-o',tone:'warning'},system:{icon:'volume-o',tone:'primary'} }

onMounted(load)
async function load() { loading.value=true;try{const data=await api.notifications(activeType.value);messages.value=data.list;unread.value=data.unread}catch(error){showToast(error instanceof Error?error.message:'消息加载失败')}finally{loading.value=false} }
async function changeType(type:string){activeType.value=type;await load()}
async function open(item:NotificationItem){if(!item.readAt){await api.readNotification(item.id);item.readAt=new Date().toISOString();unread.value=Math.max(0,unread.value-1)}if(item.link)router.push(item.link.replace('/application/','/bill/'))}
async function readAll(){if(!unread.value)return;await api.readAllNotifications();messages.value.forEach(item=>item.readAt||=(new Date().toISOString()));unread.value=0;showToast('已全部标记为已读')}
</script>
<template><main class="page messages-page"><PageNav title="消息中心" :right="unread?'全部已读':undefined" @right="readAll"/><nav class="message-filters"><button v-for="item in filters" :key="item.value" type="button" :class="{active:activeType===item.value}" @click="changeType(item.value)">{{item.label}}</button></nav><van-loading v-if="loading" class="page-loading" vertical>加载中</van-loading><section v-else-if="messages.length" class="message-list"><button v-for="item in messages" :key="item.id" type="button" class="message-row" @click="open(item)"><span class="message-icon" :class="iconMap[item.type]?.tone||'primary'"><van-icon :name="iconMap[item.type]?.icon||'bell'"/></span><span class="message-copy"><b>{{item.title}}<i v-if="!item.readAt"/></b><small>{{item.content}}</small><time>{{item.createTime}}</time></span><van-icon v-if="item.link" name="arrow"/></button></section><van-empty v-else description="暂无消息"/></main></template>
