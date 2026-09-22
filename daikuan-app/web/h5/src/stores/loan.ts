import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api, authStorage, type LoanApplication } from '../api/client'

export const useLoanStore = defineStore('loan', () => {
  const loggedIn = ref(Boolean(authStorage.token()))
  const user = ref<Record<string, any> | null>(null)
  const certified = ref(false)
  const creditLimit = ref(300000)
  const availableLimit = ref(300000)
  const minLoanAmount = ref(1000)
  const amountStep = ref(1000)
  const annualRate = ref(7.2)
  const loanTerms = ref<number[]>([3, 6, 12, 24, 36])
  const applicationId = ref('KD20260911001')
  const applicationDbId = ref<number|null>(null)
  const completed = ref<string[]>([])
  const applications = ref<LoanApplication[]>([])
  const currentApplication = ref<LoanApplication|null>(null)
  const reviewStage = ref('draft')
  const loanDraft = ref({ amount: 50000, term: 12, purpose: '日常消费', bank: '' })
  const applyProfile = (profile:Record<string,any>) => { completed.value=Array.isArray(profile.completed)?profile.completed:[];certified.value=completed.value.length>=8 }
  const completeStep = async (step:string,data:Record<string,any>={}) => { const profile=await api.saveProfileStep(step,data);applyProfile(profile);return profile }
  const loginWithPassword = async (phone:string,password:string) => { const tokens=await api.passwordLogin(phone,password);authStorage.save(tokens.token,tokens.refreshToken);loggedIn.value=true;await hydrate() }
  const loginWithSms = async (phone:string,smsCode:string) => { const tokens=await api.smsLogin(phone,smsCode);authStorage.save(tokens.token,tokens.refreshToken);loggedIn.value=true;await hydrate() }
  const logout = () => { authStorage.clear();loggedIn.value=false;user.value=null;completed.value=[];applications.value=[];currentApplication.value=null;certified.value=false;applicationDbId.value=null }
  const hydrate = async () => {
    if(!loggedIn.value)return
    const [person,profile,application,list,credit]=await Promise.all([api.person(),api.profile(),api.currentApplication(),api.applications(),api.creditInfo()])
    user.value=person;applyProfile(profile)
    creditLimit.value=Number(credit.creditLimit);availableLimit.value=Number(credit.availableLimit);minLoanAmount.value=Number(credit.minLoanAmount);amountStep.value=Number(credit.amountStep);annualRate.value=Number(credit.annualRate);loanTerms.value=credit.terms
    const profileBank=profile.bankName&&profile.bankCardNo?`${profile.bankName}（尾号 ${String(profile.bankCardNo).slice(-4)}）`:''
    if(profileBank)loanDraft.value={...loanDraft.value,bank:profileBank}
    applications.value=list;currentApplication.value=application as LoanApplication|null
    if(application){applicationDbId.value=application.id;applicationId.value=application.applicationNo;reviewStage.value=application.status;loanDraft.value={amount:Number(application.amount),term:application.term,purpose:application.purpose,bank:application.bankName||loanDraft.value.bank}}
  }
  return { loggedIn, user, certified, creditLimit, availableLimit, minLoanAmount, amountStep, annualRate, loanTerms, applicationId, applicationDbId, completed, applications, currentApplication, reviewStage, loanDraft, completeStep, loginWithPassword, loginWithSms, logout, hydrate }
})
