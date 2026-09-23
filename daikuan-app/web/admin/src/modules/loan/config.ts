import { type ModuleConfig } from '/@/cool';

export default (): ModuleConfig => ({
	ignore: { token: ['/support/public'] },
	views: [{ path: '/loan/support', meta: { label: '客服工作台' }, component: () => import('./views/support.vue') }],
	pages: [{ path: '/support/public', meta: { label: '客服会话', process: false }, component: () => import('./views/support-public.vue') }]
});
