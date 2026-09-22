<template>
	<div class="login-settings">
		<div class="settings-head">
			<div>
				<h1>用户登录设置</h1>
				<p>管理 H5 验证码登录的测试行为</p>
			</div>
			<el-button :icon="Back" @click="$router.back()">返回</el-button>
		</div>

		<el-alert
			v-if="form.testMode"
			title="测试模式已开启，任何手机号均可使用万能验证码登录"
			type="warning"
			show-icon
			:closable="false"
		/>

		<div class="settings-form" v-loading="loading">
			<div class="setting-row">
				<div><b>登录测试模式</b><span>关闭后将调用已配置的正式短信服务</span></div>
				<el-switch v-model="form.testMode" inline-prompt active-text="开" inactive-text="关" />
			</div>
			<div class="setting-row code-row">
				<div><b>万能验证码</b><span>仅在测试模式开启时生效，支持 4-8 位数字</span></div>
				<el-input v-model="form.universalCode" maxlength="8" inputmode="numeric" show-word-limit />
			</div>
			<div class="settings-actions"><el-button type="primary" :loading="saving" @click="save">保存设置</el-button></div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { Back } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { onMounted, ref } from 'vue';
import { useCool } from '/@/cool';

const { service } = useCool();
const loading = ref(false);
const saving = ref(false);
const form = ref({ testMode: true, universalCode: '123456' });

async function load() {
	loading.value = true;
	try {
		form.value = await service.request({ url: '/user/auth-config/get' });
	} finally {
		loading.value = false;
	}
}

async function save() {
	if (!/^\d{4,8}$/.test(form.value.universalCode)) {
		return ElMessage.warning('万能验证码必须为 4-8 位数字');
	}
	saving.value = true;
	try {
		form.value = await service.request({ url: '/user/auth-config/save', method: 'POST', data: form.value });
		ElMessage.success('登录设置已保存');
	} finally {
		saving.value = false;
	}
}

onMounted(load);
</script>

<style lang="scss" scoped>
.login-settings { height: 100%; padding: 24px; overflow: auto; background: #f5f7fa; }
.settings-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.settings-head h1 { margin: 0; color: #1f2937; font-size: 22px; letter-spacing: 0; }
.settings-head p { margin: 7px 0 0; color: #8491a5; font-size: 13px; }
.settings-form { max-width: 760px; margin-top: 16px; background: #fff; border: 1px solid #e8ecf2; border-radius: 8px; }
.setting-row { min-height: 82px; padding: 18px 20px; display: flex; align-items: center; justify-content: space-between; gap: 30px; border-bottom: 1px solid #edf0f5; }
.setting-row b, .setting-row span { display: block; }
.setting-row b { color: #253044; font-size: 15px; }
.setting-row span { margin-top: 6px; color: #8a94a6; font-size: 12px; }
.code-row .el-input { width: 220px; }
.settings-actions { padding: 18px 20px; text-align: right; }
@media (max-width: 640px) { .setting-row { align-items: flex-start; flex-direction: column; gap: 14px; } .code-row .el-input { width: 100%; } }
</style>
