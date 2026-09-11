<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { useLoanStore } from '../stores/loan'
const phone=ref('13800138000'),code=ref('888888'),agreed=ref(true),router=useRouter(),store=useLoanStore()
const login=()=>{if(!agreed.value)return showToast('请先同意相关协议');store.loggedIn=true;router.replace('/home')}
</script>
<template><main class="auth-page"><div class="login-brand"><i>快</i><h1>欢迎使用快贷</h1><p>快速小额借款 · 清晰透明</p></div><van-form @submit="login"><van-cell-group inset><van-field v-model="phone" type="tel" maxlength="11" label="手机号" placeholder="请输入手机号" :rules="[{required:true,message:'请输入手机号'}]"/><van-field v-model="code" type="digit" maxlength="6" label="验证码" placeholder="演示验证码 888888"><template #button><van-button size="small" type="primary" plain>获取验证码</van-button></template></van-field></van-cell-group><div class="agreement"><van-checkbox v-model="agreed" shape="square" icon-size="16">我已阅读并同意《用户服务协议》《隐私政策》《个人信息授权书》</van-checkbox></div><van-button class="wide-button" round block type="primary" native-type="submit">登录并继续</van-button></van-form><p class="demo-hint">本产品为交互原型，不会发送短信或提交真实个人信息</p></main></template>
