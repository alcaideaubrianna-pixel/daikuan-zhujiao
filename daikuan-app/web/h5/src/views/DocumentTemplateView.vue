<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import PageNav from '../components/PageNav.vue'

const route = useRoute()
const type = computed(() => String(route.params.type))

const template = computed(() => type.value === 'disclaimer' ? {
  title: '借款免责协议原模板',
  file: '/documents/loan-disclaimer-template.doc',
  filename: '借款免责协议原模板.doc',
} : {
  title: '借条原模板',
  file: '/documents/iou-template.docx',
  filename: '借条原模板.docx',
})
</script>

<template>
  <main class="page document-template-page">
    <PageNav :title="template.title" />
    <van-notice-bar wrapable left-icon="info-o" text="以下为客户提供的空白原模板，仅供材料准备参考，请核对内容后使用。" />

    <article v-if="type === 'disclaimer'" class="document-sheet">
      <h1>借款免责协议</h1>
      <p>免责声明：根据《中华人民共和国合同法》及相关法律法规的规定，甲乙双方在平等、自愿、公平、诚信、合法的基础上，就甲方出借资金给乙方，达成如下协议。</p>
      <ol>
        <li>甲方需保证出借给乙方资金来源的合法性，不得存在任何法律风险。如资金来源不明、存在法律风险，甲方负全部法律责任。</li>
        <li>乙方需保证还款资金来源的合法性和稳定性，不得存在任何法律风险、纠纷。</li>
        <li>乙方应保证借款资金使用途径合法合规，不得将借款资金用于非法用途。甲方不承担出借资金以后乙方使用资金用途的任何法律风险。</li>
        <li>甲方应保证在借条借款资金合同期内，不得以任何理由向乙方催收借款资金，不得通过电话、上门等形式骚扰其亲朋好友以及影响出借人的正常生活。</li>
        <li>如乙方违反本次协议约定，甲方有权随时终止本次借款。</li>
        <li>根据甲乙双方协商，本次借款严格按照以上协议执行；违反协议约定，一切后果自行承担。</li>
      </ol>
      <div class="document-signatures">
        <p>（出借人）甲方：____________</p><p>（借款人）乙方：____________</p>
        <p>身份证：____________________</p><p>身份证：____________________</p>
        <p>联系方式：__________________</p><p>联系方式：__________________</p>
      </div>
    </article>

    <article v-else class="document-sheet">
      <h1>借条</h1>
      <p>本人（借款人）身份证号：________________，现因________________，于______年____月____日，向（出借人）身份证号：________________借款人民币合计（大写）________________元整（小写：¥____________元）。</p>
      <p>自愿按照利息______%（每年）支付上述欠款利息，承诺于______年____月____日前偿还清全部欠款和利息。</p>
      <p>违约责任：借款人应按约定时间归还借款。如有违约，每个月按欠款金额的 2% 支付违约金，直到本金还完为止。</p>
      <p>如到期未还清欠款和利息，为实现债权的费用，包括但不限于律师费、诉讼费、差旅费、误工费等，均由____________承担。</p>
      <p>特立此据。</p>
      <div class="document-signatures document-signatures--single">
        <p>出借人：____________（签名 + 按手印）</p>
        <p>借款人：____________（签名 + 按手印）</p>
        <p>签订日期：______年____月____日</p>
      </div>
    </article>

    <BottomActionBar>
      <van-button :url="template.file" :download="template.filename" round block type="primary" icon="down">
        下载 Word 原模板
      </van-button>
    </BottomActionBar>
  </main>
</template>
