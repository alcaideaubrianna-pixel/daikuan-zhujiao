export interface ApiResult<T> { code: number; message?: string; data: T }
export interface LoanApplication {
  id: number; applicationNo: string; amount: number; term: number; annualRate: number; purpose: string;
  bankName?: string; bankCardNo?: string; status: string; reviewRemark?: string;
  submittedAt?: string; createTime: string; reviewLogs?: Record<string, any>[];
}
export interface BankOption { id: number; code: string; name: string; shortName?: string }
export interface CreditInfo {
  creditLimit: number; availableLimit: number; minLoanAmount: number;
  amountStep: number; annualRate: number; terms: number[];
}
export interface LoanAgreement {
  id: number; code: string; title: string; version: string; content: string;
  orderNum: number; updateTime?: string;
}
export interface NotificationItem { id:number;type:string;title:string;content:string;link?:string;readAt?:string;createTime:string }
export interface UserBankCard { id:number;bankCode:string;bankName:string;cardNo:string;lastFour:string;isDefault:number;status:number }

const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
const TOKEN_KEY = 'kuaidai_token'
const REFRESH_KEY = 'kuaidai_refresh_token'
export const AUTH_EXPIRED_EVENT = 'kuaidai:auth-expired'

export const authStorage = {
  token: () => localStorage.getItem(TOKEN_KEY) || '',
  refreshToken: () => localStorage.getItem(REFRESH_KEY) || '',
  save: (token: string, refreshToken: string) => { localStorage.setItem(TOKEN_KEY, token); localStorage.setItem(REFRESH_KEY, refreshToken) },
  clear: () => { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(REFRESH_KEY) },
}

let refreshing: Promise<boolean> | null = null

async function refreshAccessToken() {
  const refreshToken = authStorage.refreshToken()
  if (!refreshToken) return false
  try {
    const response = await fetch(`${API_BASE}/app/user/login/refreshToken`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ refreshToken }) })
    const result: ApiResult<{ token: string; refreshToken: string }> = await response.json()
    if (!response.ok || result.code !== 1000) return false
    authStorage.save(result.data.token, result.data.refreshToken)
    return true
  } catch { return false }
}

export async function request<T>(path: string, init: RequestInit = {}, retry = true): Promise<T> {
  const headers = new Headers(init.headers)
  if (!(init.body instanceof FormData)) headers.set('Content-Type', 'application/json')
  if (authStorage.token()) headers.set('Authorization', authStorage.token())
  const response = await fetch(`${API_BASE}${path}`, { ...init, headers })
  if (response.status === 401 && retry) {
    refreshing ||= refreshAccessToken().finally(() => { refreshing = null })
    if (await refreshing) return request<T>(path, init, false)
    authStorage.clear()
    window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT))
  }
  let result: ApiResult<T>
  try { result = await response.json() } catch { throw new Error('服务器响应异常，请稍后重试') }
  if (!response.ok || result.code !== 1000) throw new Error(result.message || '请求失败，请稍后重试')
  return result.data
}

export const api = {
  passwordLogin: (phone: string, password: string) => request<{ token: string; refreshToken: string }>('/app/user/login/h5', { method: 'POST', body: JSON.stringify({ phone, password }) }),
  smsLogin: (phone: string, smsCode: string) => request<{ token: string; refreshToken: string }>('/app/user/login/phone', { method: 'POST', body: JSON.stringify({ phone, smsCode }) }),
  sendSmsCode: (phone: string) => request<{ testMode: boolean; universalCode?: string }>('/app/user/login/smsCode', { method: 'POST', body: JSON.stringify({ phone }) }),
  person: () => request<Record<string, any>>('/app/user/info/person'),
  profile: () => request<Record<string, any>>('/app/loan/profile/info'),
  saveProfile: (data: Record<string, any>) => request<Record<string, any>>('/app/loan/profile/save', { method: 'POST', body: JSON.stringify(data) }),
  saveProfileStep: (step: string, data: Record<string, any> = {}) => request<Record<string, any>>('/app/loan/profile/step', { method: 'POST', body: JSON.stringify({ step, data }) }),
  banks: () => request<BankOption[]>('/app/loan/bank/list'),
  creditInfo: () => request<CreditInfo>('/app/loan/credit/info'),
  agreements: () => request<LoanAgreement[]>('/app/loan/agreement/list'),
  notifications: (type = 'all') => request<{ list: NotificationItem[]; unread: number }>(`/app/loan/notification/list?type=${encodeURIComponent(type)}`),
  readNotification: (id: number) => request<void>('/app/loan/notification/read', { method: 'POST', body: JSON.stringify({ id }) }),
  readAllNotifications: () => request<void>('/app/loan/notification/read-all', { method: 'POST' }),
  bankCards: () => request<UserBankCard[]>('/app/loan/user-bank-card/list'),
  saveBankCard: (data: Record<string, any>) => request<UserBankCard>('/app/loan/user-bank-card/save', { method: 'POST', body: JSON.stringify(data) }),
  setDefaultBankCard: (id: number) => request<void>('/app/loan/user-bank-card/default', { method: 'POST', body: JSON.stringify({ id }) }),
  removeBankCard: (id: number) => request<void>('/app/loan/user-bank-card/remove', { method: 'POST', body: JSON.stringify({ id }) }),
  pageContent: (key: string) => request<{ key:string;title:string;content:string;version:string;updateTime?:string }>(`/app/loan/page-content/info?key=${encodeURIComponent(key)}`),
  uploadMedia: (file: File, purpose: string) => { const body = new FormData(); body.append('file', file); body.append('purpose', purpose); return request<Record<string, any>>('/app/loan/media/upload', { method: 'POST', body }) },
  mediaList: (purpose: string) => request<Record<string, any>[]>(`/app/loan/media/list?purpose=${encodeURIComponent(purpose)}`),
  currentApplication: () => request<Record<string, any> | null>('/app/loan/application/current'),
  applications: () => request<LoanApplication[]>('/app/loan/application/mine'),
  applicationInfo: (id: number) => request<LoanApplication>(`/app/loan/application/info?id=${id}`),
  saveDraft: (data: Record<string, any>) => request<Record<string, any>>('/app/loan/application/draft', { method: 'POST', body: JSON.stringify(data) }),
  submitApplication: (id: number, agreementIds: number[]) => request<Record<string, any>>('/app/loan/application/submit', { method: 'POST', body: JSON.stringify({ id, agreementIds }) }),
  supportMessages: (afterId = 0) => request<{ conversation: Record<string, any>; messages: Record<string, any>[] }>(`/app/loan/support/messages?afterId=${afterId}`),
  sendSupportMessage: (content: string, attachment?: Record<string, any>) => request<Record<string, any>>('/app/loan/support/send', { method: 'POST', body: JSON.stringify({ content, attachment }) }),
  uploadSupportFile: (file: File) => { const body = new FormData(); body.append('file', file); return request<{ url: string; type: string; name: string }>('/app/loan/support/upload', { method: 'POST', body }) },
  publicSupportMessages: (token: string, afterId = 0) => request<{ conversation: Record<string, any>; messages: Record<string, any>[] }>(`/app/loan/support/public/messages?token=${encodeURIComponent(token)}&afterId=${afterId}`, { headers: { Authorization: '' } }),
  publicSupportUpload: (token: string, file: File) => { const body = new FormData(); body.append('token', token); body.append('file', file); return fetch(`${API_BASE}/app/loan/public/upload`, { method: 'POST', body }).then(async response => { const result: ApiResult<{ url: string; type: string; name: string }> = await response.json(); if (!response.ok || result.code !== 1000) throw new Error(result.message || '上传失败'); return result.data }) },
  publicSupportReply: (token: string, content: string, attachment?: Record<string, any>) => request<Record<string, any>>('/app/loan/support/public/reply', { method: 'POST', headers: { Authorization: '' }, body: JSON.stringify({ token, content, attachment }) }),
}
