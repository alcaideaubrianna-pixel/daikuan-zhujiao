import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLoanStore = defineStore('loan', () => {
  const loggedIn = ref(false)
  const certified = ref(false)
  const creditLimit = ref(20000)
  const availableLimit = ref(10000)
  const applicationId = ref('KD20260911001')
  const completed = ref<string[]>([])
  const reviewStage = ref<'manual'|'phone'|'funding'|'approved'>('manual')
  const loanDraft = ref({ amount: 5000, term: 6, purpose: '日常消费', bank: '招商银行（尾号 8866）' })
  const complete = (key:string) => { if (!completed.value.includes(key)) completed.value.push(key) }
  return { loggedIn, certified, creditLimit, availableLimit, applicationId, completed, reviewStage, loanDraft, complete }
})
