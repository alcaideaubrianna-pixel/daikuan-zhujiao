<script setup lang="ts">
import { computed,ref } from 'vue'
import { useRoute,useRouter } from 'vue-router'
import { useLoanStore } from '../stores/loan'
import PageNav from '../components/PageNav.vue'
const route=useRoute(),router=useRouter(),store=useLoanStore(),step=computed(()=>String(route.params.step))
const titles:Record<string,string>={personal:'个人信息',contact:'联系人认证',bank:'收款银行卡'}
const job=ref('企业职员'),income=ref('8000-15000元'),address=ref('上海市浦东新区'),contact=ref('王女士'),phone=ref('13800132218'),bank=ref('招商银行'),card=ref('6225888800008866')
const done=()=>{store.complete(step.value);router.replace('/auth')}
</script>
<template><main class="page"><PageNav :title="titles[step]||'完善资料'"/><van-notice-bar left-icon="info-o" text="请填写真实有效的信息，本页面仅作原型演示"/><van-form @submit="done"><template v-if="step==='personal'"><div class="form-section"><h2>工作与收入</h2><van-cell-group inset><van-field v-model="job" label="职业身份" readonly is-link/><van-field v-model="income" label="月收入" readonly is-link/><van-field v-model="address" label="居住地址" :rules="[{required:true,message:'请输入居住地址'}]"/></van-cell-group></div></template><template v-else-if="step==='contact'"><div class="form-section"><h2>紧急联系人</h2><van-cell-group inset><van-field v-model="contact" label="联系人姓名" :rules="[{required:true,message:'请输入姓名'}]"/><van-field v-model="phone" type="tel" label="手机号码" :rules="[{required:true,message:'请输入手机号'}]"/><van-field label="与本人关系" model-value="朋友" readonly is-link/></van-cell-group></div><p class="section-tip">联系人仅用于必要的身份核验与紧急联系演示</p></template><template v-else><div class="form-section"><h2>绑定本人银行卡</h2><van-cell-group inset><van-field v-model="bank" label="开户银行" readonly is-link/><van-field v-model="card" type="digit" label="银行卡号" :rules="[{required:true,message:'请输入银行卡号'}]"/><van-field label="预留手机号" model-value="138****8000"/></van-cell-group></div><div class="bank-security"><van-icon name="shield-o"/><span>银行卡仅用于模拟收款与还款，不会发起真实交易</span></div></template><van-button class="fixed-cta" round block type="primary" native-type="submit">保存并完成本阶段</van-button></van-form></main></template>
