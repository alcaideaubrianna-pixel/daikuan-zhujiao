<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-refresh-btn />
			<cl-add-btn />
			<cl-multi-delete-btn />
			<cl-flex1 />
			<cl-search-key placeholder="搜索银行名称、简称或编码" />
		</cl-row>
		<cl-row><cl-table ref="Table" /></cl-row>
		<cl-row><cl-flex1 /><cl-pagination /></cl-row>
		<cl-upsert ref="Upsert" />
	</cl-crud>
</template>

<script lang="ts" setup>
defineOptions({ name: 'loan-bank' });

import { useCrud, useTable, useUpsert } from '@cool-vue/crud';
import { useCool } from '/@/cool';

const { service } = useCool();

const Table = useTable({
	columns: [
		{ type: 'selection', width: 60 },
		{ label: '银行名称', prop: 'name', minWidth: 190 },
		{ label: '简称', prop: 'shortName', minWidth: 130 },
		{ label: '银行编码', prop: 'code', minWidth: 130 },
		{ label: '排序', prop: 'orderNum', sortable: 'custom', width: 100 },
		{ label: '状态', prop: 'status', width: 100, dict: [{ label: '禁用', value: 0, type: 'danger' }, { label: '启用', value: 1, type: 'success' }] },
		{ label: '更新时间', prop: 'updateTime', sortable: 'custom', minWidth: 170 },
		{ type: 'op' }
	]
});

const Upsert = useUpsert({
	items: [
		{ label: '银行名称', prop: 'name', required: true, component: { name: 'el-input', props: { maxlength: 80 } } },
		{ label: '简称', prop: 'shortName', component: { name: 'el-input', props: { maxlength: 40 } } },
		{ label: '银行编码', prop: 'code', required: true, component: { name: 'el-input', props: { maxlength: 32 } } },
		{ label: '排序', prop: 'orderNum', value: 100, component: { name: 'el-input-number', props: { min: 0 } } },
		{ label: '状态', prop: 'status', value: 1, component: { name: 'el-radio-group', options: [{ label: '禁用', value: 0 }, { label: '启用', value: 1 }] } }
	]
});

const Crud = useCrud({ service: service.loan.bank }, app => app.refresh({ prop: 'orderNum', order: 'asc' }));
</script>
