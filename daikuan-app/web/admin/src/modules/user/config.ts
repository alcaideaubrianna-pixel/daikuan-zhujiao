import { type ModuleConfig } from '/@/cool';

export default (): ModuleConfig => {
	return {
		views: [
			{
				path: '/user/login-settings',
				meta: { label: '登录设置' },
				component: () => import('./views/login-settings.vue')
			}
		]
	};
};
