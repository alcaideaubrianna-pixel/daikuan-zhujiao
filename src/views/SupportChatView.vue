<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { showToast } from 'vant'
import PageNav from '../components/PageNav.vue'
import { api } from '../api/client'
interface Message { id:number;senderType:'staff'|'user'|'system';content:string;createTime:string }
const input=ref(''),sending=ref(false),messages=ref<Message[]>([])
const questions=['如何申请额度？','借款利息如何计算？','如何提前还款？']
let timer:number|undefined
const load=async()=>{try{const lastId=messages.value.at(-1)?.id||0;const result=await api.supportMessages(lastId);if(result.messages.length)messages.value.push(...result.messages as Message[])}catch(error){if(!messages.value.length)showToast(error instanceof Error?error.message:'记录加载失败')}}
const send=async(text=input.value.trim())=>{if(!text||sending.value)return;sending.value=true;try{const message=await api.sendSupportMessage(text);messages.value.push(message as Message);input.value=''}catch(error){showToast(error instanceof Error?error.message:'发送失败')}finally{sending.value=false}}
onMounted(async()=>{await load();timer=window.setInterval(load,5000)})
onUnmounted(()=>{if(timer)window.clearInterval(timer)})
</script>
<template><main class="chat-page"><PageNav title="在线客服" right="记录"/><div class="service-status"><span class="online-dot"/> 客服工作时间 09:30-19:30</div><section class="chat-messages"><div v-if="!messages.length" class="chat-row agent"><div class="service-avatar"><van-icon name="service-o"/></div><div><p>您好，请留言说明您的问题，客服会在工作时间尽快回复。</p><span>工作时间 09:30-19:30</span></div></div><div v-for="item in messages" :key="item.id" :class="['chat-row',item.senderType==='user'?'user':'agent']"><div v-if="item.senderType!=='user'" class="service-avatar"><van-icon name="service-o"/></div><div><p>{{item.content}}</p><span>{{item.createTime}}</span></div></div></section><section class="quick-questions"><span>猜你想问</span><van-button v-for="q in questions" :key="q" size="small" round plain type="primary" @click="send(q)">{{q}}</van-button></section><van-action-bar class="chat-composer"><van-field v-model="input" clearable placeholder="请输入您的问题" @keyup.enter="send()"><template #left-icon><van-icon name="smile-o"/></template></van-field><van-button round type="primary" :loading="sending" :disabled="!input.trim()" @click="send()">发送</van-button></van-action-bar></main></template>
