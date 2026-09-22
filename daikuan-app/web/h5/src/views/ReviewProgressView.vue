<script setup lang="ts">
import { computed, ref } from 'vue'
import { showToast } from 'vant'
import PageNav from '../components/PageNav.vue'
import { useLoanStore } from '../stores/loan'
import { getApplicationStatus, reviewStep } from '../utils/loan'

const store = useLoanStore()
const loading = ref(false)
const application = computed(() => store.currentApplication)
const status = computed(() => getApplicationStatus(application.value?.status))

async function refresh() {
  loading.value = true
  try {
    await store.hydrate()
    showToast('进度已更新')
  } catch (error) {
    showToast(error instanceof Error ? error.message : '更新失败')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="page">
    <PageNav title="申请进度" back-to="/home" />
    <template v-if="application">
      <section class="review-hero">
        <van-icon :name="application.status === 'approved' ? 'passed' : application.status === 'rejected' ? 'close' : 'clock-o'" />
        <h1>{{ status.label }}</h1>
        <p>申请编号 {{ application.applicationNo }}</p>
      </section>
      <van-steps direction="vertical" :active="reviewStep(application.status)" active-color="#2563eb">
        <van-step><h3>人工资料审核</h3><p>{{ application.status === 'manual' ? '专员正在核验申请材料' : '查看审核记录了解处理结果' }}</p></van-step>
        <van-step><h3>电话核验</h3><p>{{ application.status === 'phone' ? '请保持电话畅通' : '等待前序审核完成' }}</p></van-step>
        <van-step><h3>放款信息处理</h3><p>{{ application.status === 'funding' ? '正在核对放款信息' : '等待前序审核完成' }}</p></van-step>
        <van-step><h3>审核完成</h3><p>{{ status.description }}</p></van-step>
      </van-steps>
      <van-cell-group inset>
        <van-cell title="申请金额" :value="`¥${Number(application.amount).toLocaleString()}`" />
        <van-cell title="申请详情" value="查看完整记录" is-link :to="`/bill/${application.id}`" />
        <van-cell class="customer-service-cell" title="联系借款专员" label="工作时间 09:30-19:30" value="立即咨询" icon="service-o" is-link to="/support" />
      </van-cell-group>
    </template>
    <van-empty v-else description="暂无借款申请"><van-button type="primary" to="/auth">完善资料并申请</van-button></van-empty>
    <BottomActionBar><van-button round block type="primary" :loading="loading" @click="refresh">刷新审核进度</van-button></BottomActionBar>
  </main>
</template>
