import { createRouter, createWebHistory } from 'vue-router'
import { useLoanStore } from '../stores/loan'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/home', component: () => import('../views/HomeView.vue') },
    { path: '/login', component: () => import('../views/LoginView.vue') },
    { path: '/auth', component: () => import('../views/AuthCenterView.vue') },
    { path: '/identity', component: () => import('../views/IdentityView.vue') },
    { path: '/face-auth', component: () => import('../views/FaceAuthView.vue') },
    { path: '/profile-auth/:step', component: () => import('../views/ProfileAuthView.vue') },
    { path: '/credit-result', component: () => import('../views/CreditResultView.vue') },
    { path: '/loan', component: () => import('../views/CreateBillView.vue') },
    { path: '/contract', component: () => import('../views/ContractView.vue') },
    { path: '/application/:id', component: () => import('../views/ApplicationView.vue') },
    { path: '/bills', component: () => import('../views/BillsView.vue') },
    { path: '/bill/:id', component: () => import('../views/BillDetailView.vue') },
    { path: '/repay/:id', component: () => import('../views/RepayView.vue') },
    { path: '/messages', component: () => import('../views/MessagesView.vue') },
    { path: '/support', component: () => import('../views/SupportChatView.vue') },
    { path: '/profile', component: () => import('../views/ProfileView.vue') },
    { path: '/:pathMatch(.*)*', redirect: '/login' },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach((to) => {
  const store = useLoanStore()
  if (!store.loggedIn && !['/login'].includes(to.path)) return '/login'
  if (store.loggedIn && to.path === '/login') return '/home'
  if (to.path === '/loan' && !store.certified) return '/auth'
})

export default router
