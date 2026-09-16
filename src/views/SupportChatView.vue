<script setup lang="ts">
import { ref } from 'vue'
import PageNav from '../components/PageNav.vue'
interface Message { id:number;from:'agent'|'user';text:string;time:string }
const input=ref(''),typing=ref(false),messages=ref<Message[]>([{id:1,from:'agent',text:'您好，我是快贷在线客服。人工客服工作时间为 09:30-19:30，请问有什么可以帮您？',time:'现在'}])
const questions=['如何申请额度？','借款利息如何计算？','如何提前还款？']
const reply=(q:string)=>q.includes('额度')?'完成身份、人脸、个人信息、联系人和银行卡认证后，即可查看模拟额度。':q.includes('利息')?'借款页会展示参考年化利率、预计每期应还及总利息，最终以合同展示为准。':'您可以在“账单”中选择还款中的订单，进入详情后点击“立即还款”。'
const send=(text=input.value.trim())=>{if(!text)return;messages.value.push({id:Date.now(),from:'user',text,time:'现在'});input.value='';typing.value=true;setTimeout(()=>{typing.value=false;messages.value.push({id:Date.now()+1,from:'agent',text:reply(text),time:'现在'})},700)}
</script>
<template><main class="chat-page"><PageNav title="在线客服" right="记录"/><div class="service-status"><span class="online-dot"/> 客服工作时间 09:30-19:30</div><section class="chat-messages"><div v-for="item in messages" :key="item.id" :class="['chat-row',item.from]"><div v-if="item.from==='agent'" class="service-avatar"><van-icon name="service-o"/></div><div><p>{{item.text}}</p><span>{{item.time}}</span></div></div><div v-if="typing" class="chat-row agent"><div class="service-avatar"><van-icon name="service-o"/></div><div class="typing"><i/><i/><i/></div></div></section><section class="quick-questions"><span>猜你想问</span><van-button v-for="q in questions" :key="q" size="small" round plain type="primary" @click="send(q)">{{q}}</van-button></section><van-action-bar class="chat-composer"><van-field v-model="input" clearable placeholder="请输入您的问题" @keyup.enter="send()"><template #left-icon><van-icon name="smile-o"/></template></van-field><van-button round type="primary" :disabled="!input.trim()" @click="send()">发送</van-button></van-action-bar></main></template>
