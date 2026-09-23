<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { showToast } from 'vant'
import { AdvancedChat, type ChatModel, type MessageModel, type User } from '@advanced-chat/components'
import PageNav from '../components/PageNav.vue'
import { api } from '../api/client'

interface PublicMessage { id: number; senderType: 'staff' | 'user' | 'system'; content: string; createTime: string; attachmentUrl?: string; attachmentType?: string; attachmentName?: string }
const route = useRoute(); const token = String(route.query.token || ''); const loading = ref(true); const refreshing = ref(false); const messages = ref<MessageModel[]>([])
const visitor: User = { id: 'staff-link', name: '客服', avatar: '/favicon.svg', status: { state: 'online' } }; const customer: User = { id: 'customer', name: '客户', status: { state: 'online' } }
const chat = computed<ChatModel>(() => ({ id: 'customer', name: '客户会话', users: [visitor, customer] }))
const attachment = (item: PublicMessage) => item.attachmentUrl ? { name: item.attachmentName || '附件', type: item.attachmentType === 'video' ? 'video/mp4' : 'image/*', extension: item.attachmentType || 'file', url: item.attachmentUrl, previewUrl: item.attachmentUrl, previewable: true } : undefined
const map = (item: PublicMessage): MessageModel => ({ id: String(item.id), sender: item.senderType === 'staff' ? visitor : customer, content: item.content, createdAt: item.createTime || new Date().toISOString(), status: 'sent', files: attachment(item) ? [attachment(item)!] : undefined })
const load = async (silent = false) => { if (!token || refreshing.value) { if (!token && !silent) showToast('客服链接无效'); return }; refreshing.value = true; if (!silent) loading.value = true; try { const result = await api.publicSupportMessages(token); messages.value = (result.messages as PublicMessage[]).map(map) } catch (error) { if (!silent) showToast(error instanceof Error ? error.message : '消息加载失败') } finally { refreshing.value = false; if (!silent) loading.value = false } }
const send = async (payload: { content: string; files: Array<{ blob?: Blob; name: string; type: string }> }) => { try { let uploaded: any; const file = payload.files?.[0]?.blob; if (file) uploaded = await api.publicSupportUpload(token, new File([file], payload.files[0].name, { type: payload.files[0].type })); const item = await api.publicSupportReply(token, payload.content, uploaded); messages.value.push(map(item as PublicMessage)) } catch (error) { showToast(error instanceof Error ? error.message : '发送失败') } }
let refreshTimer: ReturnType<typeof setInterval> | undefined
onMounted(async () => { await load(); if (token) refreshTimer = setInterval(() => load(true), 2000) })
onUnmounted(() => { if (refreshTimer) clearInterval(refreshTimer) })
</script>
<template><main class="chat-page advanced-chat-page"><PageNav title="客服工作台" right=""/><section class="chat-intro"><div class="chat-intro__icon"><van-icon name="service-o" /></div><div><strong>客户会话</strong><span>请及时回复客户消息</span></div></section><AdvancedChat :current-user="visitor" :chats="[chat]" :chat="chat" :messages="messages" :loading-messages="loading" :messages-loaded="true" :chats-loaded="true" :show-chats="false" :show-search="false" :show-add-chat="false" :show-files="true" :show-emojis="false" :show-reaction-emojis="false" :show-footer="true" :show-send-icon="true" accept="image/*,video/*" :multiple="false" height="calc(100dvh - 44px)" theme="light" @send-message="send" /></main></template>
