import { createApp } from 'vue'
import 'vant/lib/index.css'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import { setToastDefaultOptions } from 'vant'
import router from './router'

setToastDefaultOptions({
  duration: 2000,
  position: 'middle',
  wordBreak: 'break-word',
})

createApp(App).use(createPinia()).use(router).mount('#app')
