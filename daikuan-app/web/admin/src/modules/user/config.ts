import { type ModuleConfig } from '/@/cool';

export default (): ModuleConfig => {
	return {
		views: [
			{
				path: '/user/login-settings',
				meta: { label: '登录设置' },
				component: () => import('./views/login-settings.vue')
			},
			{
				path: '/user/sms-code',
				meta: { label: '手机验证码' },
				component: () => import('./views/sms-code.vue')
			}
		]
	};
};
