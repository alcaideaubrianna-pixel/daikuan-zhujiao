<script setup lang="ts">
import { onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showDialog, showToast } from 'vant'
import { api } from '../api/client'
import { useLoanStore } from '../stores/loan'

type LoginMode = 'sms' | 'password'
const mode = ref<LoginMode>('sms')
const phone = ref('')
const smsCode = ref('')
const password = ref('')
const agreed = ref(false)
const loading = ref(false)
const countdown = ref(0)
const router = useRouter()
const route = useRoute()
const store = useLoanStore()
let countdownTimer: number | undefined

const validPhone = () => /^1\d{10}$/.test(phone.value)
const sendCode = async () => {
  if (!validPhone()) return showToast('请输入正确的手机号')
  if (countdown.value) return
  try {
    const result = await api.sendSmsCode(phone.value)
    showToast(result.testMode ? `测试验证码：${result.universalCode}` : '验证码已发送')
    countdown.value = 60
    countdownTimer = window.setInterval(() => {
      countdown.value -= 1
      if (!countdown.value && countdownTimer) window.clearInterval(countdownTimer)
    }, 1000)
  } catch (error) {
    showToast(error instanceof Error ? error.message : '验证码发送失败')
  }
}
const login = async () => {
  if (!agreed.value) return showToast('请先同意相关协议')
  loading.value = true
  try {
    if (mode.value === 'sms') await store.loginWithSms(phone.value, smsCode.value)
    else await store.loginWithPassword(phone.value, password.value)
    const redirect = typeof route.query.redirect === 'string' && route.query.redirect.startsWith('/') ? route.query.redirect : '/home'
    router.replace(redirect)
  } catch (error) {
    showToast(error instanceof Error ? error.message : '登录失败')
  } finally {
    loading.value = false
  }
}
const showLoanGuide = () => showDialog({
  title: '借款教程必读',
  message: '1. 提供打卡工资、真实经营店铺、稳定收入或微信/支付宝消费账单中的任意一项，并且法院没有经济纠纷或司法案件。\n\n2. 快贷郑重承诺：以上任意一项满足即可申请，额度高低可协商，不以征信作为唯一依据。\n\n3. 详细借款利率及周期，请在工作时间咨询在线客服，避免耽误时间。',
  messageAlign: 'left',
  confirmButtonText: '我知道了',
})
onUnmounted(() => { if (countdownTimer) window.clearInterval(countdownTimer) })
</script>

<template>
  <main class="auth-page">
    <header class="login-header">
      <div class="login-logo" aria-hidden="true">快</div>
      <div><b>快贷</b><span>安心、透明的借款服务</span></div>
      <van-icon name="shield-o" />
    </header>
    <section class="login-intro">
      <p>欢迎回来</p>
      <h1>登录您的账户</h1>
      <span>完成认证后，可随时查看申请和审核进度</span>
    </section>
    <section class="login-information" aria-label="借款服务说明">
      <div class="login-offer">
        <div class="login-offer__icon"><van-icon name="balance-list-o" /></div>
        <div><b>3-30 万灵活借款方案</b><span>工资或经营流水均可申请</span></div>
        <small>额度以审核为准</small>
      </div>
      <button class="loan-guide-trigger" type="button" @click="showLoanGuide">
        <span class="loan-guide-trigger__icon"><van-icon name="notes-o" /></span>
        <span><b>借款教程必读</b><small>申请条件、额度及利率周期说明</small></span>
        <van-icon name="arrow" />
      </button>
    </section>
    <section class="login-panel">
      <van-form class="login-form" @submit="login">
        <div class="login-mode" role="tablist" aria-label="登录方式">
          <button type="button" role="tab" :aria-selected="mode==='sms'" :class="{active:mode==='sms'}" @click="mode='sms'">验证码登录</button>
          <button type="button" role="tab" :aria-selected="mode==='password'" :class="{active:mode==='password'}" @click="mode='password'">密码登录</button>
        </div>
        <div class="login-fields">
          <van-field v-model="phone" type="tel" maxlength="11" label="手机号" placeholder="请输入手机号" :rules="[{required:true,pattern:/^1\d{10}$/,message:'请输入正确的手机号'}]" />
          <van-field v-if="mode==='sms'" v-model="smsCode" type="digit" maxlength="8" label="验证码" placeholder="请输入验证码" :rules="[{required:true,message:'请输入验证码'}]">
            <template #button><van-button class="sms-code-button" size="small" type="primary" plain native-type="button" :disabled="countdown>0" @click.stop="sendCode">{{countdown?`${countdown}s 后重发`:'获取验证码'}}</van-button></template>
          </van-field>
          <van-field v-else v-model="password" type="password" maxlength="32" label="登录密码" placeholder="请输入登录密码" :rules="[{required:true,validator:(value:string)=>value.length>=6,message:'请输入至少 6 位密码'}]" />
        </div>
        <van-button class="login-submit" block type="primary" native-type="submit" :loading="loading">登录并继续</van-button>
        <div class="agreement"><van-checkbox v-model="agreed" shape="square" icon-size="16">我已阅读并同意《用户服务协议》《隐私政策》《个人信息授权书》</van-checkbox></div>
      </van-form>
    </section>
    <p class="login-security"><van-icon name="shield-o" /> 信息加密传输，仅用于本次服务审核</p>
  </main>
</template>
