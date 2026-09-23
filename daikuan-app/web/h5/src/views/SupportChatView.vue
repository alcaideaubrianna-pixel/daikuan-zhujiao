<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { AdvancedChat, type ChatFileItem, type ChatModel, type MessageModel, type User } from '@advanced-chat/components'
import { api } from '../api/client'
import { useLoanStore } from '../stores/loan'

interface ApiMessage { id: number; senderType: 'staff' | 'user' | 'system'; content: string; createTime: string; attachmentUrl?: string; attachmentType?: string; attachmentName?: string }
interface SendPayload { content: string; files: ChatFileItem[] }

const store = useLoanStore()
const router = useRouter()
const messages = ref<MessageModel[]>([])
const loadingMessages = ref(false)
const refreshing = ref(false)
const sending = ref(false)
const currentUser = computed<User>(() => ({ id: String(store.user?.id || 'me'), name: String(store.user?.nickName || store.user?.phone || '我'), avatar: store.user?.avatar, status: { state: 'online' } }))
const supportUser: User = { id: 'support', name: '快贷客服', avatar: '/favicon.svg', status: { state: 'online' } }
const chat = computed<ChatModel>(() => ({ id: 'support', name: '在线客服', users: [currentUser.value, supportUser] }))

const toFile = (item: ApiMessage) => item.attachmentUrl ? [{ name: item.attachmentName || '附件', type: item.attachmentType === 'video' ? 'video/mp4' : 'image/*', extension: item.attachmentType || 'file', url: item.attachmentUrl, previewUrl: item.attachmentUrl, previewable: true }] : undefined
const toMessage = (item: ApiMessage): MessageModel => ({ id: String(item.id), sender: item.senderType === 'user' ? currentUser.value : supportUser, content: item.content || undefined, createdAt: item.createTime || new Date().toISOString(), status: 'sent', files: toFile(item) })

const loadMessages = async (silent = false) => {
  if (refreshing.value) return
  refreshing.value = true
  if (!silent) loadingMessages.value = true
  try {
    const result = await api.supportMessages(0)
    messages.value = (result.messages as ApiMessage[]).map(toMessage)
  } catch (error) {
    if (!silent) showToast(error instanceof Error ? error.message : '客服消息加载失败')
  } finally {
    refreshing.value = false
    if (!silent) loadingMessages.value = false
  }
}

const sendMessage = async ({ content, files }: SendPayload) => {
  if ((!content?.trim() && !files?.length) || sending.value) return
  sending.value = true
  try {
    let uploaded: { url: string; type: string; name: string } | undefined
    const file = files?.[0]?.blob
    if (file) uploaded = await api.uploadSupportFile(new File([file], files[0].name, { type: files[0].type }))
    const message = await api.sendSupportMessage(content?.trim() || '', uploaded)
    messages.value.push(toMessage(message as ApiMessage))
  } catch (error) { showToast(error instanceof Error ? error.message : '发送失败') } finally { sending.value = false }
}

let refreshTimer: ReturnType<typeof setInterval> | undefined
onMounted(async () => {
  if (!store.user) { try { await store.hydrate() } catch {} }
  await loadMessages()
  refreshTimer = setInterval(() => loadMessages(true), 2000)
})
onUnmounted(() => { if (refreshTimer) clearInterval(refreshTimer) })
const goBack = () => { if (window.history.state?.back) router.back(); else router.replace('/home') }
</script>

<template>
  <main class="chat-page advanced-chat-page" style="height:100dvh;overflow:hidden;position:relative">
    <button type="button" aria-label="返回" style="position:absolute;z-index:20;top:52px;left:10px;width:36px;height:36px;border:0;border-radius:50%;background:rgba(255,255,255,.92);color:#334155;box-shadow:0 2px 8px rgba(15,23,42,.12)" @click="goBack"><van-icon name="arrow-left" size="20" /></button>
    <AdvancedChat
        :current-user="currentUser"
        :chats="[chat]"
        :chat="chat"
        :messages="messages"
        :loading-messages="loadingMessages"
        :messages-loaded="true"
        :chats-loaded="true"
        :show-chats="false"
        :show-search="false"
        :show-add-chat="false"
        :show-files="true"
        :show-emojis="false"
        :show-reaction-emojis="false"
        :show-footer="true"
        :show-send-icon="true"
        accept="image/*,video/*"
        :multiple="false"
        height="100dvh"
        theme="light"
        @send-message="sendMessage"
        @fetch-messages="loadMessages"
    />
  </main>
</template>
