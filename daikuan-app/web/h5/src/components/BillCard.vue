<script setup lang="ts">
import { computed } from 'vue'
import type { LoanApplication } from '../api/client'
import { money } from '../data/demo'
import { getApplicationStatus, reviewStep } from '../utils/loan'
const props=defineProps<{bill:LoanApplication}>()
const status=computed(()=>getApplicationStatus(props.bill.status))
const progress=computed(()=>Math.min(100,Math.max(8,(reviewStep(props.bill.status)+1)*25)))
const action=computed(()=>({draft:'继续申请',manual:'查看审核',phone:'等待核验',funding:'查看进度',approved:'查看账单',rejected:'查看原因',cancelled:'查看详情'} as Record<string,string>)[props.bill.status]||'查看详情')
</script>
<template><router-link class="loan-record" :to="`/bill/${bill.id}`"><header><div><span>申请编号</span><b>{{bill.applicationNo}}</b></div><van-tag :type="status.type as any" :class="`application-status application-status--${bill.status}`">{{status.label}}</van-tag></header><section><div><small>申请金额</small><strong>{{money(Number(bill.amount))}}</strong></div><dl><div><dt>借款期限</dt><dd>{{bill.term}} 期</dd></div><div><dt>年化利率</dt><dd>{{Number(bill.annualRate||0)}}%</dd></div></dl></section><div class="loan-record__progress"><i :style="{width:`${progress}%`}"/></div><footer><span>{{bill.submittedAt||bill.createTime}}</span><b>{{action}} <van-icon name="arrow"/></b></footer></router-link></template>
