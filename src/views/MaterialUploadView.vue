<script setup lang="ts">
import { computed,ref } from 'vue'
import { useRoute,useRouter } from 'vue-router'
import { showToast } from 'vant'
import PageNav from '../components/PageNav.vue'
import { useLoanStore } from '../stores/loan'
const route=useRoute(),router=useRouter(),store=useLoanStore(),files=ref<any[]>([])
const type=computed(()=>String(route.params.type))
const config=computed(()=>({
  iou:{title:'借条材料',heading:'上传借条照片或视频',tip:'请确保借款人、金额、日期及签署信息清晰可见',examples:['纸质借条照片','借条签署视频']},
  income:{title:'收入证明',heading:'选择并上传一项收入流水',tip:'用于辅助评估持续还款能力，可任选一种材料',examples:['工资卡流水','经营流水','微信账单','支付宝账单']},
  debt:{title:'负债信息',heading:'如实补充现有负债',tip:'完整信息有助于合理评估还款能力，请勿遗漏',examples:['信用卡账单','银行贷款','网络借款']},
}[type.value]||{title:'材料上传',heading:'上传申请材料',tip:'请上传清晰完整的材料',examples:[]}))
const done=()=>{store.complete(type.value);showToast('材料已保存');router.replace('/auth')}
</script>
<template><main class="page"><PageNav :title="config.title"/><van-notice-bar wrapable left-icon="shield-o" :text="config.tip"/><section class="material-panel"><h1>{{config.heading}}</h1><div class="material-tags"><van-tag v-for="item in config.examples" :key="item" plain type="primary">{{item}}</van-tag></div><van-uploader v-model="files" multiple :max-count="6" accept="image/*,video/*" upload-icon="photograph" upload-text="照片/视频"/></section><van-cell v-if="type==='iou'" title="没有合适的借条？" value="查看平台模板" is-link to="/iou-template"/><section class="material-guide"><h2>材料要求</h2><van-steps direction="vertical" :active="2"><van-step>内容真实完整</van-step><van-step>画面清晰无遮挡</van-step><van-step>敏感信息仅用于模拟审核</van-step></van-steps></section><BottomActionBar><van-button round block type="primary" @click="done">确认提交材料</van-button></BottomActionBar></main></template>
