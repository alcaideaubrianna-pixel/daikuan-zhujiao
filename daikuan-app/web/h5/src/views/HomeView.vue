<script setup lang="ts">
import { computed } from 'vue'
import AppTabbar from '../components/AppTabbar.vue'
import { money } from '../data/demo'
import { useLoanStore } from '../stores/loan'
import { getApplicationStatus, reviewStep } from '../utils/loan'

const store = useLoanStore()
const current = computed(() => store.currentApplication)
const review = computed(() => getApplicationStatus(current.value?.status))
const approvedTotal = computed(() => store.applications.filter(item => item.status === 'approved').reduce((sum, item) => sum + Number(item.amount), 0))
</script>

<template>
  <main class="page home">
    <header class="loan-hero"><div class="brand-row"><b><i>快</i> 快贷</b><router-link to="/messages"><van-icon name="bell"/></router-link></div><p>最高可申请额度（元）</p><strong>{{ money(300000) }}</strong><span>参考年化利率 7.2% 起，额度及利率以审核结果为准</span><van-button class="hero-apply-button" block round :to="store.certified?'/loan':'/auth'">{{store.certified?'立即申请借款':'完善资料并申请'}}</van-button></header>
    <van-notice-bar wrapable left-icon="warning-o" color="#b42318" background="#fff1f0" text="快贷不收取任何放款前费用。凡以保证金、解冻费、刷流水等名义要求先付款的，均有诈骗风险。"/>
    <section v-if="current" class="review-card">
      <header class="review-card__head">
        <span>最新申请</span>
        <em :class="`status-dot status-dot--${current.status}`"><i/>{{review.label}}</em>
      </header>
      <div class="review-card__summary">
        <div><h2>{{review.label}}</h2><p>{{review.description}}</p></div>
        <strong>{{money(Number(current.amount))}}</strong>
      </div>
      <div class="review-card__meta"><span>申请编号 {{current.applicationNo}}</span><span>{{current.term}} 期</span></div>
      <ol class="compact-progress">
        <li v-for="(label,index) in ['资料审核','电话核验','放款处理','完成']" :key="label" :class="{active:index<=reviewStep(current.status),current:index===reviewStep(current.status)}"><i/><span>{{label}}</span></li>
      </ol>
      <router-link class="review-card__action" to="/review-progress"><span>查看申请进度</span><van-icon name="arrow"/></router-link>
    </section>
    <section v-else class="review-card empty-application"><van-icon name="records-o"/><div><h2>暂无借款申请</h2><p>完成资料认证后即可提交申请</p></div></section>
    <section class="feature-strip"><div><van-icon name="fire-o"/><b>快速评估</b><span>材料齐全后快速审核</span></div><div><van-icon name="shield-o"/><b>费用透明</b><span>不收取前期费用</span></div><div><van-icon name="calendar-o"/><b>灵活周期</b><span>支持 3-12 期</span></div></section>
    <section class="section-head"><h2>申请资料</h2><router-link to="/auth">{{store.certified?'查看资料':'继续认证'}} <van-icon name="arrow"/></router-link></section>
    <van-grid :column-num="4" :border="false"><van-grid-item icon="description-o" text="借条材料" to="/materials/iou"/><van-grid-item icon="balance-list-o" text="收入流水" to="/materials/income"/><van-grid-item icon="bill-o" text="负债信息" to="/materials/debt"/><van-grid-item class="customer-service-grid" icon="service-o" text="在线客服" to="/support"/></van-grid>
    <section class="section-head home-loan-title"><h2>我的借款</h2><router-link to="/bills">全部申请 <van-icon name="arrow"/></router-link></section>
    <section class="repay-card"><div class="repay-card__head"><span>累计审核通过</span><van-tag plain type="success">{{store.applications.filter(item=>item.status==='approved').length}} 笔</van-tag></div><strong>{{money(approvedTotal)}}</strong><p>申请记录、审核结果和进度均以后台数据为准</p><van-button size="small" round type="primary" to="/bills">查看申请记录</van-button></section>
    <AppTabbar/>
  </main>
</template>
