import { createApp } from 'vue'
import 'vant/lib/index.css'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import { setToastDefaultOptions } from 'vant'
import router from './router'
import { AdvancedChatPlugin } from '@advanced-chat/components'
import '@advanced-chat/components/styles'

setToastDefaultOptions({
  duration: 2000,
  position: 'middle',
  wordBreak: 'break-word',
})

createApp(App).use(createPinia()).use(router).use(AdvancedChatPlugin({ strings: {
  'chats.empty': '暂无会话', 'chats.search.placeholder': '搜索会话', 'chat.empty': '选择一个会话开始聊天', 'chat.messages.empty': '暂无消息',
  'chat.messages.new': '新消息', 'chat.message.placeholder': '请输入消息', 'chat.message.deleted': '消息已删除', 'chat.message.failure': '消息发送失败',
  'chat.typing': '正在输入…', 'chat.cancel-selection': '取消选择', 'chat.cancel-reply': '取消回复', 'chat.cancel-edit': '取消编辑',
  'chat.scroll-to-bottom': '回到底部', 'chat.user.is-online': '在线', 'chat.user.last-seen': '最后在线时间', 'chat.autocomplete.emojis': '表情',
  'chat.autocomplete.users': '用户', 'chat.state.loading': '加载中…', 'chat.state.empty': '暂无内容', 'chat.state.error': '加载失败',
  'chat.state.offline': '已离线', 'chat.state.reconnecting': '重新连接中…', 'chat.state.permission-denied': '没有权限', 'chat.state.retry': '重试'
} })).mount('#app')
