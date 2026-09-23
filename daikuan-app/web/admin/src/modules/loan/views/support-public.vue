<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { AdvancedChat, type ChatModel, type MessageModel, type User } from '@advanced-chat/components';
import '@advanced-chat/components/styles';
import { config } from '/@/config';

const token = new URLSearchParams(location.search).get('token') || '';
const messages = ref<MessageModel[]>([]);
const customerPhone = ref('');
const loading = ref(true);
const busy = ref(false);
const staff: User = { id: 'staff-link', name: '客服', avatar: '/favicon.svg', status: { state: 'online' } };
const customer: User = { id: 'customer', name: '客户', status: { state: 'online' } };
const chat = computed<ChatModel>(() => ({ id: 'customer', name: '客户会话', users: [staff, customer] }));
const mapMessage = (item: any): MessageModel => ({ id: String(item.id), sender: item.senderType === 'staff' ? staff : customer, content: item.content || undefined, createdAt: item.createTime || new Date().toISOString(), status: 'sent' });
const endpoint = `${config.baseUrl}/app/loan/support/public`;
const load = async (silent = false) => { if (!token || busy.value) return; busy.value = true; try { const response = await fetch(`${endpoint}/messages?token=${encodeURIComponent(token)}`, { headers: { Authorization: '' } }); const result = await response.json(); if (!response.ok || result.code !== 1000) throw new Error(result.message || '链接无效'); customerPhone.value = result.data?.user?.phone || result.data?.user?.nickName || ''; messages.value = (result.data?.messages || []).map(mapMessage); } catch (error: any) { if (!silent) window.alert(error?.message || '消息加载失败'); } finally { busy.value = false; loading.value = false; } };
const send = async ({ content }: { content: string }) => { if (!content?.trim() || !token || busy.value) return; busy.value = true; try { const response = await fetch(`${endpoint}/reply`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: '' }, body: JSON.stringify({ token, content: content.trim() }) }); const result = await response.json(); if (!response.ok || result.code !== 1000) throw new Error(result.message || '发送失败'); messages.value.push(mapMessage(result.data)); } catch (error: any) { window.alert(error?.message || '发送失败'); } finally { busy.value = false; } };
let timer: ReturnType<typeof setInterval> | undefined;
onMounted(async () => { await load(); timer = setInterval(() => load(true), 2000); });
onUnmounted(() => { if (timer) clearInterval(timer); });
</script>
<template><main style="height:100vh"><header style="height:56px;display:flex;align-items:center;padding:0 20px;border-bottom:1px solid #e5e7eb;font-weight:600">客服会话 <span v-if="customerPhone" style="margin-left:12px;font-weight:400;color:#64748b">{{ customerPhone }}</span></header><AdvancedChat :current-user="staff" :chats="[chat]" :chat="chat" :messages="messages" :loading-messages="loading" :messages-loaded="true" :chats-loaded="true" :show-chats="false" :show-search="false" :show-add-chat="false" :show-files="false" :show-emojis="false" :show-reaction-emojis="false" :show-footer="true" :show-send-icon="true" height="calc(100vh - 56px)" theme="light" @send-message="send" /></main></template>
