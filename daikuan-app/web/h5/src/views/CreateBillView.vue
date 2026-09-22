<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { api } from '../api/client'
import PageNav from '../components/PageNav.vue'
import { money } from '../data/demo'
import { useLoanStore } from '../stores/loan'

const store = useLoanStore()
const router = useRouter()
const amount = ref(Math.min(Math.max(store.loanDraft.amount, store.minLoanAmount), store.availableLimit))
const term = ref(store.loanTerms.includes(store.loanDraft.term) ? store.loanDraft.term : store.loanTerms[0] || 12)
const purpose = ref(store.loanDraft.purpose)
const loading = ref(false)
const purposeVisible = ref(false)
const scheduleVisible = ref(false)
const purposes = ['日常消费', '装修', '教育培训', '医疗支出', '生产经营', '旅游', '其他消费']

const monthlyRate = computed(() => store.annualRate / 100 / 12)
const monthlyPayment = computed(() => {
  if (!monthlyRate.value) return amount.value / term.value
  const factor = (1 + monthlyRate.value) ** term.value
  return amount.value * monthlyRate.value * factor / (factor - 1)
})
const totalPayment = computed(() => monthlyPayment.value * term.value)
const totalInterest = computed(() => totalPayment.value - amount.value)
const quickAmounts = computed(() => [50000, 100000, 200000].filter(value => value < store.availableLimit))
const schedule = computed(() => {
  let balance = amount.value
  return Array.from({ length: term.value }, (_, index) => {
    const interest = balance * monthlyRate.value
    const isLast = index === term.value - 1
    const principal = isLast ? balance : monthlyPayment.value - interest
    balance = Math.max(0, balance - principal)
    const dueDate = new Date()
    dueDate.setMonth(dueDate.getMonth() + index + 1)
    return {
      period: index + 1,
      date: `${dueDate.getFullYear()}-${String(dueDate.getMonth() + 1).padStart(2, '0')}-${String(dueDate.getDate()).padStart(2, '0')}`,
      payment: principal + interest,
      principal,
      interest,
      balance,
    }
  })
})

const normalizeAmount = () => {
  const min = store.minLoanAmount
  const max = store.availableLimit
  const step = store.amountStep
  const value = Math.min(max, Math.max(min, Number(amount.value) || min))
  amount.value = min + Math.round((value - min) / step) * step
}

const selectPurpose = (item: { name: string }) => {
  purpose.value = item.name
  purposeVisible.value = false
}

const next = async () => {
  normalizeAmount()
  if (!store.loanDraft.bank) return showToast('请先绑定本人收款银行卡')
  loading.value = true
  try {
    const application = await api.saveDraft({
      amount: amount.value,
      term: term.value,
      purpose: purpose.value,
    })
    store.applicationDbId = application.id
    store.applicationId = application.applicationNo
    store.loanDraft = {
      ...store.loanDraft,
      amount: amount.value,
      term: term.value,
      purpose: purpose.value,
    }
    router.push('/contract')
  } catch (error) {
    showToast(error instanceof Error ? error.message : '保存失败')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="page loan-apply-page">
    <PageNav title="申请借款" />

    <section class="loan-amount-band">
      <div class="loan-limit-line"><span>本次借款金额</span><small>可借 {{ money(store.availableLimit) }}</small></div>
      <label class="loan-amount-input">
        <span>¥</span>
        <input v-model.number="amount" inputmode="numeric" aria-label="借款金额" @blur="normalizeAmount" />
      </label>
      <van-slider v-model="amount" :min="store.minLoanAmount" :max="store.availableLimit" :step="store.amountStep" bar-height="5px" />
      <div class="loan-range"><span>{{ money(store.minLoanAmount) }}</span><span>{{ money(store.availableLimit) }}</span></div>
      <div class="quick-amounts">
        <button v-for="item in quickAmounts" :key="item" type="button" :class="{ active: amount === item }" @click="amount = item">{{ item / 10000 }}万</button>
        <button type="button" :class="{ active: amount === store.availableLimit }" @click="amount = store.availableLimit">全部额度</button>
      </div>
    </section>

    <section class="loan-section loan-term-section">
      <div class="loan-section-title"><h2>借款期限</h2><span>按月等额还款</span></div>
      <div class="term-options">
        <button v-for="item in store.loanTerms" :key="item" type="button" :class="{ active: term === item }" @click="term = item">
          <b>{{ item }}</b><span>期</span>
        </button>
      </div>
    </section>

    <section class="loan-section loan-details">
      <van-cell title="借款用途" :value="purpose" is-link clickable @click="purposeVisible = true" />
      <van-cell title="收款银行卡" :value="store.loanDraft.bank || '请先绑定'" is-link clickable to="/profile-auth/bank" />
    </section>

    <section class="repayment-summary">
      <div class="repayment-main">
        <span>预计每月还款</span>
        <strong>{{ money(monthlyPayment) }}</strong>
        <button type="button" @click="scheduleVisible = true">查看还款计划 <van-icon name="arrow" /></button>
      </div>
      <dl>
        <div><dt>年化利率</dt><dd>{{ store.annualRate }}%</dd></div>
        <div><dt>利息合计</dt><dd>{{ money(totalInterest) }}</dd></div>
        <div><dt>还款总额</dt><dd>{{ money(totalPayment) }}</dd></div>
      </dl>
    </section>

    <p class="loan-rate-note"><van-icon name="info-o" /> 以上为等额本息试算结果，具体还款金额以借款合同为准</p>

    <BottomActionBar><van-button block type="primary" :loading="loading" @click="next">确认借款信息</van-button></BottomActionBar>

    <van-action-sheet v-model:show="purposeVisible" :actions="purposes.map(name => ({ name }))" title="选择借款用途" cancel-text="取消" @select="selectPurpose" />

    <van-popup v-model:show="scheduleVisible" position="bottom" round class="schedule-popup">
      <header><div><b>还款计划</b><span>{{ term }} 期 · 等额本息</span></div><button type="button" aria-label="关闭" @click="scheduleVisible = false"><van-icon name="cross" /></button></header>
      <div class="schedule-total"><span>还款总额</span><strong>{{ money(totalPayment) }}</strong><small>含利息 {{ money(totalInterest) }}</small></div>
      <div class="schedule-list">
        <div v-for="item in schedule" :key="item.period" class="schedule-row">
          <div><b>第 {{ item.period }} 期</b><span>{{ item.date }}</span></div>
          <div><strong>{{ money(item.payment) }}</strong><span>本金 {{ money(item.principal) }} · 利息 {{ money(item.interest) }}</span></div>
        </div>
      </div>
    </van-popup>
  </main>
</template>

<style scoped>
.loan-apply-page { padding-bottom: 0; background: #f2f4f7; }
.loan-amount-band { padding: 24px 20px 22px; background: #fff; border-bottom: 1px solid #e5e9f0; }
.loan-limit-line { display: flex; align-items: center; justify-content: space-between; }
.loan-limit-line > span { color: #596579; font-size: 13px; }
.loan-limit-line small { color: #087d6f; font-size: 12px; font-weight: 600; }
.loan-amount-input { display: flex; align-items: baseline; margin: 18px 0 24px; border-bottom: 1px solid #dce2ea; }
.loan-amount-input span { color: #162033; font-size: 28px; font-weight: 700; }
.loan-amount-input input { width: 100%; min-width: 0; padding: 0 8px 12px; border: 0; outline: 0; color: #111827; background: transparent; font-size: 45px; font-weight: 720; line-height: 1; letter-spacing: 0; }
.loan-range { display: flex; justify-content: space-between; margin-top: 8px; color: #8a94a5; font-size: 10px; }
.quick-amounts { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-top: 18px; }
.quick-amounts button { min-width: 0; height: 34px; padding: 0 4px; border: 1px solid #dce2ea; border-radius: 6px; color: #4c586d; background: #fff; font-size: 12px; }
.quick-amounts button.active { color: #1748bd; border-color: #8eb0f6; background: #eef4ff; font-weight: 700; }
.loan-section { margin-top: 10px; padding: 18px 16px; background: #fff; }
.loan-section-title { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.loan-section-title h2 { margin: 0; font-size: 16px; }
.loan-section-title span { color: #8a94a5; font-size: 11px; }
.term-options { display: grid; grid-template-columns: repeat(5, 1fr); gap: 7px; }
.term-options button { height: 54px; padding: 0; border: 1px solid #dfe4eb; border-radius: 6px; color: #526077; background: #fff; }
.term-options b { font-size: 18px; }
.term-options span { margin-left: 2px; font-size: 10px; }
.term-options button.active { color: #1748bd; border-color: #6f9cf3; background: #edf4ff; }
.loan-details { padding: 0; }
.loan-details :deep(.van-cell) { padding: 16px; }
.repayment-summary { margin-top: 10px; color: #172033; background: #fff; border-top: 1px solid #e5e9f0; border-bottom: 1px solid #e5e9f0; }
.repayment-main { padding: 20px 18px 17px; position: relative; }
.repayment-main > span { display: block; color: #7c8799; font-size: 11px; }
.repayment-main > strong { display: block; margin-top: 7px; font-size: 28px; letter-spacing: 0; }
.repayment-main button { position: absolute; right: 16px; bottom: 20px; padding: 0; border: 0; color: #2563eb; background: transparent; font-size: 11px; }
.repayment-summary dl { margin: 0; padding: 15px 18px; display: grid; grid-template-columns: repeat(3, 1fr); border-top: 1px solid #edf0f4; background: #fafbfc; }
.repayment-summary dl > div + div { padding-left: 14px; border-left: 1px solid #e1e6ed; }
.repayment-summary dt { color: #7c8799; font-size: 10px; }
.repayment-summary dd { margin: 5px 0 0; font-size: 13px; font-weight: 650; }
.loan-rate-note { margin: 14px 16px 0; display: flex; gap: 6px; color: #7c8799; font-size: 10px; line-height: 1.55; }
.loan-rate-note .van-icon { margin-top: 2px; color: #0f9f8f; }
.loan-apply-page :deep(.bottom-action-bar) { background: #fff; }
.loan-apply-page :deep(.bottom-action-bar .van-button) { border-radius: 8px; font-weight: 700; }
.schedule-popup { height: min(78vh, 680px); overflow: hidden; background: #f4f6f9; }
.schedule-popup > header { height: 60px; padding: 0 16px; display: flex; align-items: center; justify-content: space-between; background: #fff; border-bottom: 1px solid #e5e9f0; }
.schedule-popup header b, .schedule-popup header span { display: block; }
.schedule-popup header b { font-size: 16px; }
.schedule-popup header span { margin-top: 3px; color: #8490a3; font-size: 10px; }
.schedule-popup header button { width: 36px; height: 36px; padding: 0; border: 0; color: #667287; background: transparent; font-size: 20px; }
.schedule-total { padding: 18px; background: #fff; }
.schedule-total span, .schedule-total small { color: #7d899c; font-size: 10px; }
.schedule-total strong { margin: 0 10px; color: #172033; font-size: 22px; }
.schedule-list { height: calc(100% - 145px); margin-top: 8px; overflow-y: auto; background: #fff; }
.schedule-row { min-height: 67px; padding: 13px 16px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #edf0f4; }
.schedule-row > div:last-child { text-align: right; }
.schedule-row b, .schedule-row strong, .schedule-row span { display: block; }
.schedule-row b, .schedule-row strong { font-size: 13px; }
.schedule-row span { margin-top: 4px; color: #8994a6; font-size: 9px; }
@media (max-width: 350px) { .term-options { grid-template-columns: repeat(3, 1fr); } .quick-amounts { grid-template-columns: repeat(2, 1fr); } }
</style>
