<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-refresh-btn />
			<cl-add-btn />
			<cl-multi-delete-btn />
			<el-button type="primary" plain @click="openSmsSettings">短信渠道设置</el-button>
			<cl-flex1 />
			<cl-select
				:options="options.dataType"
				prop="dataType"
				:width="120"
				:placeholder="$t('数据类型')"
			/>
			<cl-search-key :placeholder="$t('搜索名称、keyName')" />
		</cl-row>

		<cl-row>
			<cl-table ref="Table" />
		</cl-row>

		<cl-row>
			<cl-flex1 />
			<cl-pagination />
		</cl-row>

		<cl-upsert ref="Upsert" />

		<el-dialog v-model="smsSettingsVisible" title="短信登录配置" width="680px" :close-on-click-modal="false">
			<el-form v-loading="smsSettingsLoading" label-width="150px">
				<el-form-item label="登录测试模式">
					<el-switch v-model="smsSettings.testMode" inline-prompt active-text="开" inactive-text="关" />
				</el-form-item>
				<el-form-item label="万能验证码">
					<el-input v-model="smsSettings.universalCode" maxlength="8" inputmode="numeric" />
				</el-form-item>
				<el-form-item label="短信发送渠道">
					<el-select v-model="smsSettings.smsProvider" style="width: 100%">
						<el-option label="系统短信插件" value="plugin" />
						<el-option label="网易云信" value="yunxin" />
					</el-select>
				</el-form-item>
				<template v-if="smsSettings.smsProvider === 'yunxin'">
					<el-form-item label="网易云信 AppKey">
						<el-input v-model="smsSettings.yunxinAppKey" autocomplete="off" />
					</el-form-item>
					<el-form-item label="网易云信 AppSecret">
						<el-input v-model="smsSettings.yunxinAppSecret" type="password" show-password autocomplete="new-password" />
						<div class="form-tip">{{ smsSettings.yunxinAppSecretConfigured ? '密钥已保存在服务端；留空表示不修改' : '密钥只发送到后端保存，不会在页面回显' }}</div>
					</el-form-item>
					<el-form-item label="验证码模板 ID">
						<el-input v-model="smsSettings.yunxinTemplateId" inputmode="numeric" autocomplete="off" />
						<div class="form-tip">填写已审核通过的模板 ID，模板变量需使用 #{code}</div>
					</el-form-item>
					<el-form-item label="验证码长度">
						<el-input-number v-model="smsSettings.yunxinCodeLen" :min="4" :max="10" />
					</el-form-item>
				</template>
				<el-form-item v-if="smsSettings.yunxinAppSecretConfigured && smsSettings.smsProvider !== 'yunxin'" label="清除已保存云信密钥">
					<el-switch v-model="smsSettings.clearYunxinAppSecret" />
				</el-form-item>
				<el-form-item label="测试发送手机号">
					<el-input v-model="smsTestPhone" type="tel" maxlength="20" autocomplete="tel" placeholder="请输入手机号（国际号码请带区号）" />
					<div class="form-tip">将先保存当前配置，再通过所选短信渠道发送测试验证码；测试验证码不能用于登录，真实发送可能产生费用。</div>
				</el-form-item>
				<el-alert
					title="测试模式开启时，用户登录不会真实发送短信；下方测试按钮仍会真实发送一条测试短信。"
					type="warning"
					:closable="false"
				/>
			</el-form>
			<template #footer>
				<el-button @click="smsSettingsVisible = false">取消</el-button>
				<el-button :loading="smsSettingsTesting" :disabled="smsSettingsSaving" @click="sendSmsTest">发送测试短信</el-button>
				<el-button type="primary" :loading="smsSettingsSaving" :disabled="smsSettingsTesting" @click="saveSmsSettings()">保存配置</el-button>
			</template>
		</el-dialog>
	</cl-crud>
</template>

<script lang="ts" setup>
defineOptions({
	name: 'sys-param'
});

import { useCrud, useTable, useUpsert } from '@cool-vue/crud';
import { Document } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { reactive, ref } from 'vue';
import { useCool } from '/@/cool';
import { useI18n } from 'vue-i18n';

const { service } = useCool();
const { t } = useI18n();

type SmsSettings = {
	testMode: boolean;
	universalCode: string;
	smsProvider: 'plugin' | 'yunxin';
	yunxinAppKey: string;
	yunxinAppSecret: string;
	yunxinAppSecretConfigured: boolean;
	yunxinTemplateId: string;
	yunxinCodeLen: number;
	clearYunxinAppSecret: boolean;
};

const createSmsSettings = (): SmsSettings => ({
	testMode: false,
	universalCode: '123456',
	smsProvider: 'plugin',
	yunxinAppKey: '',
	yunxinAppSecret: '',
	yunxinAppSecretConfigured: false,
	yunxinTemplateId: '',
	yunxinCodeLen: 6,
	clearYunxinAppSecret: false
});

const smsSettingsVisible = ref(false);
const smsSettingsLoading = ref(false);
const smsSettingsSaving = ref(false);
const smsSettingsTesting = ref(false);
const smsTestPhone = ref('');
const smsSettings = ref<SmsSettings>(createSmsSettings());

async function openSmsSettings() {
	smsSettingsVisible.value = true;
	smsSettingsLoading.value = true;
	try {
		const saved = await service.request({ url: '/user/auth-config/get' });
		smsSettings.value = { ...createSmsSettings(), ...saved, yunxinAppSecret: '', clearYunxinAppSecret: false };
	} finally {
		smsSettingsLoading.value = false;
	}
}

async function saveSmsSettings(showSuccess = true): Promise<boolean> {
	if (!/^\d{4,8}$/.test(smsSettings.value.universalCode)) {
		ElMessage.warning('万能验证码必须为 4-8 位数字');
		return false;
	}
	if (smsSettings.value.smsProvider === 'yunxin') {
		if (!smsSettings.value.yunxinAppKey.trim() || !/^\d+$/.test(smsSettings.value.yunxinTemplateId.trim())) {
			ElMessage.warning('请填写网易云信 AppKey 和验证码模板 ID');
			return false;
		}
		if (!smsSettings.value.yunxinAppSecretConfigured && !smsSettings.value.yunxinAppSecret.trim()) {
			ElMessage.warning('请填写网易云信 AppSecret');
			return false;
		}
		if (smsSettings.value.clearYunxinAppSecret) {
			ElMessage.warning('请先切换到其他短信渠道，再清除云信密钥');
			return false;
		}
	}
	smsSettingsSaving.value = true;
	try {
		const saved = await service.request({ url: '/user/auth-config/save', method: 'POST', data: smsSettings.value });
		smsSettings.value = { ...createSmsSettings(), ...saved, yunxinAppSecret: '', clearYunxinAppSecret: false };
		if (showSuccess) ElMessage.success('短信登录配置已保存');
		return true;
	} catch {
		ElMessage.error('短信登录配置保存失败');
		return false;
	} finally {
		smsSettingsSaving.value = false;
	}
}

async function sendSmsTest() {
	const testPhone = smsTestPhone.value.trim();
	const normalizedTestPhone = testPhone.replace(/[\s-]/g, '');
	if (!/^1[3-9]\d{9}$/.test(testPhone) && !/^\+[1-9]\d{6,14}$/.test(normalizedTestPhone)) {
		return ElMessage.warning('请输入有效的手机号，国际号码请带国家或地区区号');
	}
	smsSettingsTesting.value = true;
	try {
		const saved = await saveSmsSettings(false);
		if (!saved) return;
		await service.request({
			url: '/user/auth-config/test-sms',
			method: 'POST',
			data: { phone: testPhone }
		});
		ElMessage.success('测试短信已提交，请留意手机短信');
	} catch {
		ElMessage.error('测试短信发送失败，请检查短信渠道、模板及账户状态');
	} finally {
		smsSettingsTesting.value = false;
	}
}

// 选项
const options = reactive({
	dataType: [
		{
			label: t('字符串'),
			value: 0,
			type: 'info'
		},
		{
			label: t('富文本'),
			value: 1,
			type: 'success'
		},
		{
			label: t('文件'),
			value: 2
		}
	]
});

// cl-crud
const Crud = useCrud({ service: service.base.sys.param }, app => {
	app.refresh();
});

// cl-table
const Table = useTable({
	columns: [
		{
			type: 'selection',
			width: 60
		},
		{
			label: t('名称'),
			prop: 'name',
			minWidth: 150
		},
		{
			label: 'keyName',
			prop: 'keyName',
			minWidth: 150
		},
		{
			label: '数据',
			prop: 'data',
			minWidth: 200,
			component: {
				name: 'cl-code-json',
				props: {
					popover: true
				}
			}
		},
		{
			label: t('数据类型'),
			prop: 'dataType',
			minWidth: 120,
			dict: options.dataType
		},
		{
			label: t('备注'),
			prop: 'remark',
			minWidth: 200,
			showOverflowTooltip: true
		},
		{
			type: 'op'
		}
	]
});

// cl-upsert
const Upsert = useUpsert({
	dialog: {
		width: '1000px'
	},

	items: [
		{
			prop: 'name',
			label: t('名称'),
			span: 12,
			required: true,
			component: {
				name: 'el-input'
			}
		},
		{
			prop: 'keyName',
			label: 'keyName',
			span: 12,
			required: true,
			component: {
				name: 'el-input',
				props: {
					placeholder: t('请输入Key')
				}
			}
		},
		{
			prop: 'dataType',
			label: t('类型'),
			value: 0,
			required: true,
			component: {
				name: 'el-radio-group',
				options: options.dataType
			}
		},
		{
			prop: 'data_0',
			label: t('数据'),
			hidden({ scope }) {
				return scope.dataType != 0;
			},
			required: true,
			component: {
				name: 'el-input',
				props: {
					rows: 12,
					type: 'textarea'
				}
			}
		},
		{
			prop: 'data_1',
			label: t('数据'),
			hidden({ scope }) {
				return scope.dataType != 1;
			},
			required: true,
			component: {
				name: 'cl-editor',
				props: {
					name: 'cl-editor-wang'
				}
			}
		},
		{
			prop: 'data_2',
			label: t('数据'),
			required: true,
			hidden({ scope }) {
				return scope.dataType != 2;
			},
			component: {
				name: 'cl-upload',
				props: {
					icon: Document,
					multiple: true,
					type: 'file'
				}
			}
		},
		{
			prop: 'remark',
			label: t('备注'),
			component: {
				name: 'el-input',
				props: {
					placeholder: t('请输入备注'),
					rows: 3,
					type: 'textarea'
				}
			}
		}
	],

	onOpened(data) {
		data[`data_${data.dataType}`] = data.data;
	},

	onSubmit(data, { next }) {
		next({
			...data,
			data: data[`data_${data.dataType}`],
			data_0: undefined,
			data_1: undefined,
			data_2: undefined
		});
	}
});
</script>

<style lang="scss" scoped>
.form-tip { margin-top: 4px; color: #909399; font-size: 12px; line-height: 1.5; }
</style>
