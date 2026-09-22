<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { showToast } from 'vant'
import { api } from '../api/client'
import PageNav from '../components/PageNav.vue'
const route=useRoute(),loading=ref(true),page=ref<{title:string;content:string;version:string;updateTime?:string}|null>(null)
const safeContent=computed(()=>{const doc=new DOMParser().parseFromString(page.value?.content||'','text/html');doc.querySelectorAll('script,style,iframe,object,embed,form').forEach(node=>node.remove());doc.body.querySelectorAll('*').forEach(el=>[...el.attributes].forEach(attr=>{if(attr.name.startsWith('on')||['src','srcdoc'].includes(attr.name)||(attr.name==='href'&&/^\s*(javascript|data):/i.test(attr.value)))el.removeAttribute(attr.name)}));return doc.body.innerHTML})
onMounted(async()=>{try{page.value=await api.pageContent(String(route.params.key))}catch(error){showToast(error instanceof Error?error.message:'内容加载失败')}finally{loading.value=false}})
</script>
<template><main class="page content-page"><PageNav :title="page?.title||'页面内容'"/><van-loading v-if="loading" class="page-loading" vertical>加载中</van-loading><article v-else-if="page" class="managed-content"><div v-html="safeContent"/><footer>版本 {{page.version}}<span v-if="page.updateTime"> · 更新于 {{page.updateTime}}</span></footer></article><van-empty v-else description="内容暂未配置"/></main></template>
