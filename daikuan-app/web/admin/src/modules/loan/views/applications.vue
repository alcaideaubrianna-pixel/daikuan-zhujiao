<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-refresh-btn />
			<cl-flex1 />
			<cl-select :options="statusOptions" prop="status" :width="130" placeholder="申请状态" />
			<cl-search-key placeholder="搜索申请编号、手机号或用户" />
		</cl-row>
		<cl-row><cl-table ref="Table" /></cl-row>
		<cl-row><cl-flex1 /><cl-pagination /></cl-row>
	</cl-crud>

	<el-dialog v-model="visible" title="借款申请详情" width="min(920px, 92vw)" destroy-on-close>
		<div v-loading="detailLoading" class="loan-detail">
			<el-result v-if="detailError" icon="error" title="详情加载失败" :sub-title="detailError">
				<template #extra><el-button type="primary" @click="loadDetail">重新加载</el-button></template>
			</el-result>
			<template v-if="detail.application">
				<el-descriptions title="申请信息" :column="3" border>
					<el-descriptions-item label="申请编号">{{ detail.application.applicationNo }}</el-descriptions-item>
					<el-descriptions-item label="手机号">{{ detail.user?.phone || '-' }}</el-descriptions-item>
					<el-descriptions-item label="状态">{{ statusLabel(detail.application.status) }}</el-descriptions-item>
					<el-descriptions-item label="金额">¥{{ detail.application.amount }}</el-descriptions-item>
					<el-descriptions-item label="期数">{{ detail.application.term }} 期</el-descriptions-item>
					<el-descriptions-item label="用途">{{ detail.application.purpose || '-' }}</el-descriptions-item>
				</el-descriptions>
				<el-descriptions class="detail-section" title="申请人资料" :column="2" border>
					<el-descriptions-item label="姓名">{{ detail.profile?.realName || '-' }}</el-descriptions-item>
					<el-descriptions-item label="身份证号">{{ detail.profile?.idCardNo || '-' }}</el-descriptions-item>
					<el-descriptions-item label="职业">{{ detail.profile?.job || '-' }}</el-descriptions-item>
					<el-descriptions-item label="月收入">{{ detail.profile?.income || '-' }}</el-descriptions-item>
					<el-descriptions-item label="居住地址" :span="2">{{ detail.profile?.address || '-' }}</el-descriptions-item>
					<el-descriptions-item label="开户银行">{{ detail.profile?.bankName || '-' }}</el-descriptions-item>
					<el-descriptions-item label="银行卡号">{{ detail.profile?.bankCardNo || '-' }}</el-descriptions-item>
				</el-descriptions>
				<section class="detail-section"><h3>联系人</h3><el-table :data="detail.profile?.contacts || []" border><el-table-column prop="relation" label="关系"/><el-table-column prop="name" label="姓名"/><el-table-column prop="phone" label="手机号"/></el-table></section>
				<section class="detail-section"><h3>申请附件</h3><div class="media-grid"><div v-for="item in detail.media || []" :key="item.id" class="media-item"><el-image v-if="item.mediaType==='image'" :src="item.url" :preview-src-list="imageUrls" preview-teleported fit="cover"/><a v-else :href="item.url" target="_blank">查看视频/文件</a><span>{{ purposeLabel(item.purpose) }}</span></div><el-empty v-if="!detail.media?.length" description="暂无附件"/></div></section>
				<section class="detail-section"><h3>审核记录</h3><el-timeline><el-timeline-item v-for="item in detail.reviewLogs || []" :key="item.id" :timestamp="item.createTime"><b>{{ statusLabel(item.toStatus) }}</b><p>{{ item.remark || '无备注' }}</p></el-timeline-item></el-timeline></section>
			</template>
		</div>
		<template #footer><el-button @click="visible=false">关闭</el-button><el-button type="danger" :disabled="!canReview" @click="review('rejected')">拒绝</el-button><el-button type="primary" :disabled="!canReview" @click="review(nextStatus)">{{ nextAction }}</el-button></template>
	</el-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useCrud, useTable } from '@cool-vue/crud';
import { useCool } from '/@/cool';

defineOptions({ name: 'loan-applications' });
const { service } = useCool();
const applicationService = (service as any).loan.application;
const visible = ref(false);
const detailLoading = ref(false);
const detail = ref<any>({});
const detailError = ref('');
const currentId = ref<number>();
const statusOptions = reactive([
	{ label: '草稿', value: 'draft' }, { label: '人工审核', value: 'manual' },
	{ label: '电话核验', value: 'phone' }, { label: '放款处理中', value: 'funding' },
	{ label: '已通过', value: 'approved' }, { label: '已拒绝', value: 'rejected' }
]);
const statusLabel = (value: string) => statusOptions.find(item => item.value === value)?.label || value;
const purposeLabel = (value: string) => ({ iou:'借条材料',income:'收入证明',debt:'负债信息',id_card_front:'身份证人像面',id_card_back:'身份证国徽面' } as Record<string,string>)[value] || value;
const imageUrls = computed(() => (detail.value.media || []).filter((item:any) => item.mediaType === 'image').map((item:any) => item.url));
const canReview = computed(() => ['manual','phone','funding'].includes(detail.value.application?.status));
const nextStatus = computed(() => ({ manual:'phone',phone:'funding',funding:'approved' } as Record<string,string>)[detail.value.application?.status] || 'approved');
const nextAction = computed(() => ({ manual:'通过初审',phone:'通过电话核验',funding:'确认审核通过' } as Record<string,string>)[detail.value.application?.status] || '已完成');

const loadDetail = async () => {
	if (!currentId.value) return;
	detailLoading.value = true;
	detailError.value = '';
	try {
		detail.value = await applicationService.request({ url: '/detail', params: { id: currentId.value } });
	} catch (error: any) {
		detailError.value = error?.message || '无法获取申请资料，请稍后重试';
	} finally {
		detailLoading.value = false;
	}
};
const openDetail = async (row:any) => { currentId.value=Number(row.id);detail.value={application:row,user:{phone:row.phone}};visible.value=true;await loadDetail() };
const review = async (status:string) => { try{const { value }=await ElMessageBox.prompt(status==='rejected'?'请输入拒绝原因':'请输入审核备注','审核确认',{inputPlaceholder:'审核备注将展示在审核记录中',inputValidator:value=>Boolean(value?.trim())||'请输入审核备注'});await applicationService.request({url:'/review',method:'POST',data:{id:detail.value.application.id,status,remark:value}});ElMessage.success('审核状态已更新');await loadDetail();Crud.value?.refresh()}catch(error:any){if(error!=='cancel'&&error?.message!=='cancel') ElMessage.error(error?.message||'审核失败')} };
const Table = useTable({ columns: [
	{ label:'申请编号',prop:'applicationNo',minWidth:190 }, { label:'手机号',prop:'phone',minWidth:130 },
	{ label:'姓名',prop:'userName',minWidth:110 }, { label:'申请金额',prop:'amount',minWidth:110 },
	{ label:'期数',prop:'term',minWidth:80 }, { label:'状态',prop:'status',dict:statusOptions,minWidth:120 },
	{ label:'提交时间',prop:'submittedAt',minWidth:170 }, { type:'op',width:110,buttons:[{label:'查看审核',type:'primary',onClick:({scope}:any)=>openDetail(scope.row)}] }
] });
const Crud = useCrud({ service: applicationService }, app => app.refresh());
</script>

<style scoped>
.detail-section{margin-top:24px}.detail-section h3{margin:0 0 12px;font-size:16px}.media-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:12px}.media-item{min-width:0}.media-item .el-image{width:100%;height:100px;border-radius:6px;background:#f3f5f8}.media-item span{display:block;margin-top:6px;color:#667085;font-size:12px}.media-item a{height:100px;display:grid;place-items:center;border:1px solid #dcdfe6;border-radius:6px;color:#2563eb}
</style>
