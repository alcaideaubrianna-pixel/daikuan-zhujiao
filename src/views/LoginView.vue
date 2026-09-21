<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showDialog, showToast } from 'vant'
import { useLoanStore } from '../stores/loan'
const phone=ref(''),password=ref(''),agreed=ref(false),loading=ref(false),router=useRouter(),route=useRoute(),store=useLoanStore()
const login=async()=>{if(!agreed.value)return showToast('请先同意相关协议');loading.value=true;try{await store.login(phone.value,password.value);const redirect=typeof route.query.redirect==='string'&&route.query.redirect.startsWith('/')?route.query.redirect:'/home';router.replace(redirect)}catch(error){showToast(error instanceof Error?error.message:'登录失败')}finally{loading.value=false}}
const showLoanGuide=()=>showDialog({title:'借款教程必读',message:'1. 提供打卡工资、真实经营店铺、稳定收入或微信/支付宝消费账单中的任意一项，并且法院没有经济纠纷或司法案件。\n\n2. 快贷郑重承诺：以上任意一项满足即可申请，额度高低可协商，不以征信作为唯一依据。\n\n3. 详细借款利率及周期，请在工作时间咨询在线客服，避免耽误时间。',messageAlign:'left',confirmButtonText:'我知道了'})
</script>
<template>
  <main class="auth-page">
    <div class="login-brand"><i>快</i><h1>欢迎使用快贷</h1><p>快速借款服务 · 资料清晰 · 费用透明</p><div class="login-offer"><b>3-30 万灵活借款方案</b><span>提供工资流水或经营流水，并完成借条材料认证后可提交申请</span><small>额度、利率及是否通过以实际审核结果为准</small></div></div>
    <button class="loan-guide-trigger" type="button" @click="showLoanGuide"><span><van-icon name="notes-o"/><b>借款教程必读</b></span><small>申请条件、额度说明及利率周期须知</small><van-icon name="arrow"/></button>
    <van-form class="login-form" @submit="login">
      <van-cell-group inset>
        <van-field v-model="phone" type="tel" maxlength="11" label="手机号" placeholder="请输入手机号" :rules="[{required:true,pattern:/^1\d{10}$/,message:'请输入正确的手机号'}]"/>
        <van-field v-model="password" type="password" maxlength="32" label="登录密码" placeholder="首次登录将自动注册" :rules="[{required:true,validator:(value:string)=>value.length>=6,message:'请输入至少 6 位密码'}]"/>
      </van-cell-group>
      <div class="agreement"><van-checkbox v-model="agreed" shape="square" icon-size="16">我已阅读并同意《用户服务协议》《隐私政策》《个人信息授权书》</van-checkbox></div>
      <BottomActionBar><van-button round block type="primary" native-type="submit" :loading="loading">登录并继续</van-button></BottomActionBar>
    </van-form>
    <p class="demo-hint">未注册手机号将自动创建账号</p>
  </main>
</template>
