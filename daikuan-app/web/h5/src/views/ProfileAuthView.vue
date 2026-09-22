<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast } from 'vant'
import type { BankOption } from '../api/client'
import { api } from '../api/client'
import PageNav from '../components/PageNav.vue'
import { useLoanStore } from '../stores/loan'

const route = useRoute()
const router = useRouter()
const store = useLoanStore()
const step = computed(() => String(route.params.step))
const titles: Record<string, string> = { personal: '个人信息', contact: '联系人认证', bank: '收款银行卡' }

const job = ref('企业职员')
const income = ref('8000-15000元')
const address = ref('上海市浦东新区')
const relative = ref('王女士')
const relativePhone = ref('13800132218')
const friendOne = ref('周先生')
const friendOnePhone = ref('13900138876')
const friendTwo = ref('陈女士')
const friendTwoPhone = ref('13600136658')
const bankCode = ref('')
const bankName = ref('')
const card = ref('')
const banks = ref<BankOption[]>([])
const bankKeyword = ref('')
const bankPopupVisible = ref(false)
const bankLoading = ref(false)
const loading = ref(false)

const filteredBanks = computed(() => {
  const keyword = bankKeyword.value.trim().toLowerCase()
  if (!keyword) return banks.value
  return banks.value.filter(bank =>
    [bank.name, bank.shortName, bank.code].some(value => String(value || '').toLowerCase().includes(keyword)),
  )
})

const loadBanks = async () => {
  if (banks.value.length || bankLoading.value) return
  bankLoading.value = true
  try {
    banks.value = await api.banks()
  } catch (error) {
    showToast(error instanceof Error ? error.message : '银行列表加载失败')
  } finally {
    bankLoading.value = false
  }
}

const openBankPopup = async () => {
  bankPopupVisible.value = true
  await loadBanks()
}

const selectBank = (bank: BankOption) => {
  bankCode.value = bank.code
  bankName.value = bank.name
  bankPopupVisible.value = false
  bankKeyword.value = ''
}

const done = async () => {
  loading.value = true
  try {
    const data = step.value === 'personal'
      ? { job: job.value, income: income.value, address: address.value }
      : step.value === 'contact'
        ? { contacts: [
          { name: relative.value, phone: relativePhone.value, relation: '亲属' },
          { name: friendOne.value, phone: friendOnePhone.value, relation: '朋友' },
          { name: friendTwo.value, phone: friendTwoPhone.value, relation: '朋友' },
        ] }
        : { bankCode: bankCode.value, bankName: bankName.value, bankCardNo: card.value }
    if (step.value === 'bank') {
      await api.saveBankCard(data)
      await store.hydrate()
    } else {
      await store.completeStep(step.value, data)
    }
    showToast('资料已保存')
    router.replace('/auth')
  } catch (error) {
    showToast(error instanceof Error ? error.message : '保存失败')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  try {
    const profile = await api.profile()
    job.value = profile.job || job.value
    income.value = profile.income || income.value
    address.value = profile.address || address.value
    bankCode.value = profile.bankCode || ''
    bankName.value = profile.bankName || ''
    card.value = profile.bankCardNo || ''
    if (Array.isArray(profile.contacts)) {
      const [r, f1, f2] = profile.contacts
      if (r) { relative.value = r.name; relativePhone.value = r.phone }
      if (f1) { friendOne.value = f1.name; friendOnePhone.value = f1.phone }
      if (f2) { friendTwo.value = f2.name; friendTwoPhone.value = f2.phone }
    }
    if (step.value === 'bank') await loadBanks()
  } catch {
    showToast('资料加载失败')
  }
})
</script>

<template>
  <main class="page">
    <PageNav :title="titles[step] || '完善资料'" />
    <van-notice-bar left-icon="info-o" text="请填写真实有效的信息，提交后可在申请前继续修改" />
    <van-form class="page-form" @submit="done">
      <template v-if="step === 'personal'">
        <div class="form-section">
          <h2>工作与收入</h2>
          <van-cell-group inset>
            <van-field v-model="job" label="职业身份" :rules="[{ required: true, message: '请输入职业身份' }]" />
            <van-field v-model="income" label="月收入" :rules="[{ required: true, message: '请输入月收入' }]" />
            <van-field v-model="address" label="居住地址" :rules="[{ required: true, message: '请输入居住地址' }]" />
          </van-cell-group>
        </div>
      </template>
      <template v-else-if="step === 'contact'">
        <div class="form-section">
          <h2>直系亲属</h2>
          <van-cell-group inset>
            <van-field v-model="relative" label="联系人姓名" :rules="[{ required: true, message: '请输入姓名' }]" />
            <van-field v-model="relativePhone" maxlength="11" type="tel" label="手机号码" :rules="[{ required: true, pattern: /^1\d{10}$/, message: '请输入正确手机号' }]" />
            <van-field label="与本人关系" model-value="亲属" readonly />
          </van-cell-group>
        </div>
        <div class="form-section">
          <h2>朋友联系人一</h2>
          <van-cell-group inset>
            <van-field v-model="friendOne" label="联系人姓名" :rules="[{ required: true, message: '请输入姓名' }]" />
            <van-field v-model="friendOnePhone" maxlength="11" type="tel" label="手机号码" :rules="[{ required: true, pattern: /^1\d{10}$/, message: '请输入正确手机号' }]" />
          </van-cell-group>
        </div>
        <div class="form-section">
          <h2>朋友联系人二</h2>
          <van-cell-group inset>
            <van-field v-model="friendTwo" label="联系人姓名" :rules="[{ required: true, message: '请输入姓名' }]" />
            <van-field v-model="friendTwoPhone" maxlength="11" type="tel" label="手机号码" :rules="[{ required: true, pattern: /^1\d{10}$/, message: '请输入正确手机号' }]" />
          </van-cell-group>
        </div>
        <p class="section-tip">请确保 3 位联系人真实有效：1 位直系亲属、2 位朋友</p>
      </template>
      <template v-else>
        <div class="form-section">
          <h2>绑定本人银行卡</h2>
          <van-cell-group inset>
            <van-field
              :model-value="bankName"
              label="开户银行"
              placeholder="请选择开户银行"
              readonly
              is-link
              clickable
              :rules="[{ required: true, message: '请选择开户银行' }]"
              @click="openBankPopup"
            />
            <van-field v-model="card" maxlength="24" type="digit" label="银行卡号" placeholder="请输入本人银行卡号" :rules="[{ required: true, pattern: /^\d{12,24}$/, message: '请输入正确银行卡号' }]" />
          </van-cell-group>
        </div>
        <div class="bank-security"><van-icon name="shield-o" /><span>银行卡信息加密保存，仅用于收款与还款</span></div>
      </template>
      <BottomActionBar><van-button round block type="primary" native-type="submit" :loading="loading">保存并完成本阶段</van-button></BottomActionBar>
    </van-form>

    <van-popup v-model:show="bankPopupVisible" position="bottom" round class="bank-picker-popup">
      <header class="bank-picker-header">
        <b>选择开户银行</b>
        <button type="button" aria-label="关闭" @click="bankPopupVisible = false"><van-icon name="cross" /></button>
      </header>
      <van-search v-model="bankKeyword" placeholder="搜索银行名称或简称" />
      <div class="bank-picker-list">
        <van-loading v-if="bankLoading" vertical>正在加载银行列表</van-loading>
        <van-cell
          v-for="item in filteredBanks"
          v-else
          :key="item.code"
          :title="item.name"
          :label="item.shortName && item.shortName !== item.name ? item.shortName : undefined"
          clickable
          @click="selectBank(item)"
        >
          <template #right-icon><van-icon v-if="bankCode === item.code" name="success" color="#0f9f8f" /></template>
        </van-cell>
        <van-empty v-if="!bankLoading && !filteredBanks.length" description="未找到匹配的银行" />
      </div>
    </van-popup>
  </main>
</template>

<style scoped>
.bank-picker-popup { height: min(72vh, 620px); overflow: hidden; }
.bank-picker-header { height: 52px; padding: 0 16px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--line); }
.bank-picker-header b { font-size: 16px; }
.bank-picker-header button { width: 36px; height: 36px; padding: 0; border: 0; color: var(--muted); background: transparent; font-size: 20px; }
.bank-picker-list { height: calc(100% - 106px); overflow-y: auto; -webkit-overflow-scrolling: touch; }
.bank-picker-list > .van-loading { padding-top: 80px; }
</style>
