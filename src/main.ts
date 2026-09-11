import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import 'vant/lib/index.css'

createApp(App).use(createPinia()).use(router).mount('#app')
