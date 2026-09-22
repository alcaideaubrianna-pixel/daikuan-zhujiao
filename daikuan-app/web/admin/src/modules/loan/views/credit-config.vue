<template>
	<cl-crud ref="Crud">
		<cl-row>
			<el-button type="primary" :loading="opening" @click="openConfig">修改配置</el-button>
			<cl-refresh-btn />
			<cl-flex1 />
		</cl-row>
		<cl-row><cl-table ref="Table" /></cl-row>
		<cl-upsert ref="Upsert" />
	</cl-crud>
</template>

<script lang="ts" setup>
defineOptions({ name: 'loan-credit-config' });

import { useCrud, useTable, useUpsert } from '@cool-vue/crud';
import { ElMessage } from 'element-plus';
import { ref } from 'vue';
import { useCool } from '/@/cool';

const { service } = useCool();
const opening = ref(false);
const termOptions = [3, 6, 12, 24, 36, 48].map(value => ({ label: `${value}期`, value }));

const Table = useTable({
	columns: [
		{ label: '最低随机额度', prop: 'minCredit', minWidth: 140 },
		{ label: '最高随机额度', prop: 'maxCredit', minWidth: 140 },
		{ label: '最低借款金额', prop: 'minLoanAmount', minWidth: 140 },
		{ label: '金额步长', prop: 'amountStep', minWidth: 110 },
		{ label: '年化利率', prop: 'annualRate', minWidth: 110, formatter: (row: any) => `${Number(row.annualRate)}%` },
		{ label: '可选期数', prop: 'terms', minWidth: 180, formatter: (row: any) => (row.terms || []).map((item: number) => `${item}期`).join('、') },
		{ label: '状态', prop: 'status', width: 100, dict: [{ label: '禁用', value: 0, type: 'danger' }, { label: '启用', value: 1, type: 'success' }] },
		{ type: 'op', buttons: ['edit'], width: 100 }
	]
});

const Upsert = useUpsert({
	dialog: { width: '620px' },
	items: [
		{ label: '最低随机额度', prop: 'minCredit', required: true, component: { name: 'el-input-number', props: { min: 1, step: 10000 } } },
		{ label: '最高随机额度', prop: 'maxCredit', required: true, component: { name: 'el-input-number', props: { min: 1, step: 10000 } } },
		{ label: '最低借款金额', prop: 'minLoanAmount', required: true, component: { name: 'el-input-number', props: { min: 1, step: 1000 } } },
		{ label: '金额步长', prop: 'amountStep', required: true, component: { name: 'el-input-number', props: { min: 1, step: 100 } } },
		{ label: '年化利率(%)', prop: 'annualRate', required: true, component: { name: 'el-input-number', props: { min: 0.001, max: 100, step: 0.1, precision: 3 } } },
		{ label: '可选期数', prop: 'terms', required: true, component: { name: 'el-select', props: { multiple: true }, options: termOptions } },
		{ label: '状态', prop: 'status', component: { name: 'el-radio-group', options: [{ label: '禁用', value: 0 }, { label: '启用', value: 1 }] } }
	]
});

const Crud = useCrud({ service: service.loan.creditConfig }, app => app.refresh());

async function openConfig() {
	opening.value = true;

	try {
		const { list = [] } = await service.loan.creditConfig.page({ page: 1, size: 1 });
		const config = list[0];

		if (!config) {
			ElMessage.warning('暂无可修改的额度配置');
			return;
		}

		Crud.value?.rowEdit(config);
	} finally {
		opening.value = false;
	}
}
</script>
