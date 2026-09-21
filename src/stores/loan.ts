import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api, authStorage } from '../api/client'

export const useLoanStore = defineStore('loan', () => {
  const loggedIn = ref(Boolean(authStorage.token()))
  const user = ref<Record<string, any> | null>(null)
  const certified = ref(false)
  const creditLimit = ref(20000)
  const availableLimit = ref(10000)
  const applicationId = ref('KD20260911001')
  const applicationDbId = ref<number|null>(null)
  const completed = ref<string[]>([])
  const reviewStage = ref<'manual'|'phone'|'funding'|'approved'>('manual')
  const loanDraft = ref({ amount: 5000, term: 6, purpose: '日常消费', bank: '招商银行（尾号 8866）' })
  const complete = (key:string) => { if (!completed.value.includes(key)) completed.value.push(key) }
  const login = async (phone:string,password:string) => { const tokens=await api.login(phone,password);authStorage.save(tokens.token,tokens.refreshToken);loggedIn.value=true;await hydrate() }
  const logout = () => { authStorage.clear();loggedIn.value=false;user.value=null;completed.value=[];certified.value=false;applicationDbId.value=null }
  const hydrate = async () => {
    if(!loggedIn.value)return
    const [person,profile,application]=await Promise.all([api.person(),api.profile(),api.currentApplication()])
    user.value=person;completed.value=Array.isArray(profile.completed)?profile.completed:[];certified.value=completed.value.length>=7
    if(application){applicationDbId.value=application.id;applicationId.value=application.applicationNo;if(['manual','phone','funding','approved'].includes(application.status))reviewStage.value=application.status;loanDraft.value={amount:Number(application.amount),term:application.term,purpose:application.purpose,bank:application.bankName||loanDraft.value.bank}}
  }
  return { loggedIn, user, certified, creditLimit, availableLimit, applicationId, applicationDbId, completed, reviewStage, loanDraft, complete, login, logout, hydrate }
})
