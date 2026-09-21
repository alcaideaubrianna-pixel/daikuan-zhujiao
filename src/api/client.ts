export interface ApiResult<T> { code: number; message?: string; data: T }

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
  login: (phone: string, password: string) => request<{ token: string; refreshToken: string }>('/app/user/login/h5', { method: 'POST', body: JSON.stringify({ phone, password }) }),
  person: () => request<Record<string, any>>('/app/user/info/person'),
  profile: () => request<Record<string, any>>('/app/loan/profile/info'),
  saveProfile: (data: Record<string, any>) => request<Record<string, any>>('/app/loan/profile/save', { method: 'POST', body: JSON.stringify(data) }),
  saveProfileStep: (step: string, data: Record<string, any> = {}) => request<Record<string, any>>('/app/loan/profile/step', { method: 'POST', body: JSON.stringify({ step, data }) }),
  uploadMedia: (file: File, purpose: string) => { const body = new FormData(); body.append('file', file); body.append('purpose', purpose); return request<Record<string, any>>('/app/loan/media/upload', { method: 'POST', body }) },
  mediaList: (purpose: string) => request<Record<string, any>[]>(`/app/loan/media/list?purpose=${encodeURIComponent(purpose)}`),
  currentApplication: () => request<Record<string, any> | null>('/app/loan/application/current'),
  saveDraft: (data: Record<string, any>) => request<Record<string, any>>('/app/loan/application/draft', { method: 'POST', body: JSON.stringify(data) }),
  submitApplication: (id: number) => request<Record<string, any>>('/app/loan/application/submit', { method: 'POST', body: JSON.stringify({ id }) }),
  supportMessages: (afterId = 0) => request<{ conversation: Record<string, any>; messages: Record<string, any>[] }>(`/app/loan/support/messages?afterId=${afterId}`),
  sendSupportMessage: (content: string) => request<Record<string, any>>('/app/loan/support/send', { method: 'POST', body: JSON.stringify({ content }) }),
}
