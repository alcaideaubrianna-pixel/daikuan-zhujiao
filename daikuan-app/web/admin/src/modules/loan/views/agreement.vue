<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-refresh-btn />
			<cl-add-btn />
			<cl-multi-delete-btn />
			<cl-flex1 />
			<cl-search-key placeholder="搜索合同名称、编码或版本" />
		</cl-row>
		<cl-row><cl-table ref="Table" /></cl-row>
		<cl-row><cl-flex1 /><cl-pagination /></cl-row>
		<cl-upsert ref="Upsert" />
	</cl-crud>
</template>

<script lang="ts" setup>
defineOptions({ name: 'loan-agreement' });

import { useCrud, useTable, useUpsert } from '@cool-vue/crud';
import { useCool } from '/@/cool';

const { service } = useCool();

const Table = useTable({
	columns: [
		{ type: 'selection', width: 60 },
		{ label: '合同名称', prop: 'title', minWidth: 200 },
		{ label: '合同编码', prop: 'code', minWidth: 150 },
		{ label: '版本', prop: 'version', width: 100 },
		{ label: '排序', prop: 'orderNum', sortable: 'custom', width: 90 },
		{ label: '状态', prop: 'status', width: 90, dict: [{ label: '停用', value: 0, type: 'danger' }, { label: '启用', value: 1, type: 'success' }] },
		{ label: '更新时间', prop: 'updateTime', sortable: 'custom', minWidth: 170 },
		{ type: 'op', width: 150 }
	]
});

const Upsert = useUpsert({
	dialog: { width: '900px' },
	items: [
		{ label: '合同名称', prop: 'title', required: true, component: { name: 'el-input', props: { maxlength: 100 } } },
		{ label: '合同编码', prop: 'code', required: true, component: { name: 'el-input', props: { maxlength: 40 } } },
		{ label: '版本', prop: 'version', required: true, value: '1.0', component: { name: 'el-input', props: { maxlength: 30 } } },
		{ label: '合同正文', prop: 'content', required: true, component: { name: 'cl-editor', props: { name: 'cl-editor-wang', height: 430 } } },
		{ label: '排序', prop: 'orderNum', value: 100, component: { name: 'el-input-number', props: { min: 0 } } },
		{ label: '状态', prop: 'status', value: 1, component: { name: 'el-radio-group', options: [{ label: '停用', value: 0 }, { label: '启用', value: 1 }] } }
	]
});

const Crud = useCrud({ service: service.loan.agreement }, app => app.refresh({ prop: 'orderNum', order: 'asc' }));
</script>
