<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { money } from '../data/demo'
import { useLoanStore } from '../stores/loan'
import { api, type LoanAgreement } from '../api/client'
import PageNav from '../components/PageNav.vue'

const store = useLoanStore()
const router = useRouter()
const agreements = ref<LoanAgreement[]>([])
const viewedIds = ref<number[]>([])
const agreed = ref(false)
const loading = ref(false)
const fetching = ref(true)
const activeAgreement = ref<LoanAgreement | null>(null)
const canConfirmRead = ref(false)
const contentEl = ref<HTMLElement | null>(null)

const allRead = computed(() => agreements.value.length === 3 && agreements.value.every(item => viewedIds.value.includes(item.id)))
const safeContent = computed(() => sanitizeHtml(activeAgreement.value?.content || ''))

onMounted(loadAgreements)

async function loadAgreements() {
  fetching.value = true
  try {
    agreements.value = await api.agreements()
    if (agreements.value.length !== 3) showToast('合同配置异常，请联系客服')
  } catch (error) {
    showToast(error instanceof Error ? error.message : '合同加载失败')
  } finally {
    fetching.value = false
  }
}

async function openAgreement(agreement: LoanAgreement) {
  activeAgreement.value = agreement
  canConfirmRead.value = viewedIds.value.includes(agreement.id)
  await nextTick()
  const element = contentEl.value
  if (element && element.scrollHeight <= element.clientHeight + 8) canConfirmRead.value = true
}

function handleContentScroll(event: Event) {
  const element = event.currentTarget as HTMLElement
  if (element.scrollTop + element.clientHeight >= element.scrollHeight - 12) canConfirmRead.value = true
}

function confirmRead() {
  if (!activeAgreement.value || !canConfirmRead.value) return
  if (!viewedIds.value.includes(activeAgreement.value.id)) viewedIds.value.push(activeAgreement.value.id)
  activeAgreement.value = null
}

function sanitizeHtml(html: string) {
  const documentNode = new DOMParser().parseFromString(html, 'text/html')
  documentNode.querySelectorAll('script,style,iframe,object,embed,form').forEach(node => node.remove())
  documentNode.body.querySelectorAll('*').forEach(element => {
    for (const attribute of [...element.attributes]) {
      if (attribute.name.startsWith('on') || ['src', 'srcdoc'].includes(attribute.name)) element.removeAttribute(attribute.name)
      if (attribute.name === 'href' && /^\s*(javascript|data):/i.test(attribute.value)) element.removeAttribute(attribute.name)
    }
  })
  return documentNode.body.innerHTML
}

async function submit() {
  if (!allRead.value) return showToast('请逐份阅读全部三份合同')
  if (!agreed.value) return showToast('请勾选同意全部合同')
  if (!store.applicationDbId) return showToast('请先确认借款信息')
  loading.value = true
  try {
    await api.submitApplication(store.applicationDbId, agreements.value.map(item => item.id))
    store.reviewStage = 'manual'
    router.replace('/review-progress')
  } catch (error) {
    showToast(error instanceof Error ? error.message : '提交失败')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="page contract-page">
    <PageNav title="确认借款" />
    <section class="contract-summary">
      <p>到账金额</p>
      <strong>{{ money(store.loanDraft.amount) }}</strong>
      <span>审核通过后按约定放款</span>
    </section>

    <van-cell-group inset>
      <van-cell title="借款期数" :value="`${store.loanDraft.term} 期`" />
      <van-cell title="收款银行卡" :value="store.loanDraft.bank" />
      <van-cell title="还款方式" value="等额本息" />
      <van-cell title="年化利率" :value="`${store.annualRate}%`" />
      <van-cell title="提前还款" value="无额外手续费" />
    </van-cell-group>

    <section class="agreement-list">
      <div class="agreement-heading">
        <h2>合同与授权</h2>
        <span>{{ viewedIds.length }}/3 已阅读</span>
      </div>
      <van-loading v-if="fetching" class="agreement-loading" size="22px">正在加载合同</van-loading>
      <template v-else>
        <button v-for="item in agreements" :key="item.id" class="agreement-row" type="button" @click="openAgreement(item)">
          <span class="agreement-row__icon"><van-icon name="description-o" /></span>
          <span class="agreement-row__copy"><b>《{{ item.title }}》</b><small>版本 {{ item.version }}</small></span>
          <span v-if="viewedIds.includes(item.id)" class="agreement-read"><van-icon name="passed" /> 已阅读</span>
          <van-icon v-else name="arrow" class="agreement-arrow" />
        </button>
        <van-checkbox v-model="agreed" shape="square" :disabled="!allRead">
          我已逐份阅读并同意以上全部合同，确认借款信息无误
        </van-checkbox>
        <p v-if="!allRead" class="agreement-tip">请点击合同名称逐份阅读，完成后方可勾选</p>
      </template>
    </section>

    <BottomActionBar>
      <van-button block type="primary" :disabled="!allRead || !agreed" :loading="loading" @click="submit">同意合同并提交申请</van-button>
    </BottomActionBar>

    <van-popup :show="Boolean(activeAgreement)" position="bottom" class="agreement-popup" :close-on-click-overlay="false" @update:show="value => { if (!value) activeAgreement = null }">
      <header class="agreement-popup__head">
        <button type="button" aria-label="关闭" @click="activeAgreement = null"><van-icon name="cross" /></button>
        <div><b>{{ activeAgreement?.title }}</b><span>版本 {{ activeAgreement?.version }}</span></div>
        <i />
      </header>
      <article ref="contentEl" class="agreement-content" @scroll="handleContentScroll">
        <div v-html="safeContent" />
        <p class="agreement-end">合同正文结束</p>
      </article>
      <footer class="agreement-popup__footer">
        <p v-if="!canConfirmRead">请阅读至合同底部</p>
        <van-button block type="primary" :disabled="!canConfirmRead" @click="confirmRead">我已阅读并理解</van-button>
      </footer>
    </van-popup>
  </main>
</template>
