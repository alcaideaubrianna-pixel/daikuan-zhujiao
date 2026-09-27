import { type ModuleConfig } from '/@/cool';

export default (): ModuleConfig => {
	return {
		views: [
			{
				path: '/user/sms-code',
				meta: { label: '手机验证码' },
				component: () => import('./views/sms-code.vue')
			}
		]
	};
};
