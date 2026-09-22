<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { api } from '../api/client'
import { useLoanStore } from '../stores/loan'
import PageNav from '../components/PageNav.vue'
import { isValidChineseIdCard } from '../utils/idCard'

const name = ref('')
const idCardNo = ref('')
const front = ref<any[]>([])
const back = ref<any[]>([])
const loading = ref(false)
const pageLoading = ref(true)
const router = useRouter()
const store = useLoanStore()
const uploadedCount = computed(() => Number(Boolean(front.value[0]?.mediaId)) + Number(Boolean(back.value[0]?.mediaId)))
const validateIdCard = (value: string) => isValidChineseIdCard(value) || '请输入正确的身份证号'

const upload = async (item: any, purpose: string) => {
  item.status = 'uploading'
  item.message = '上传中'
  try {
    const media = await api.uploadMedia(item.file, purpose)
    Object.assign(item, { url: media.url, mediaId: media.id, status: 'done', message: '' })
  } catch (error) {
    item.status = 'failed'
    item.message = error instanceof Error ? error.message : '上传失败'
  }
}
const done = async () => {
  if (!front.value[0]?.mediaId || !back.value[0]?.mediaId) return showToast('请上传身份证正反面')
  loading.value = true
  try {
    await store.completeStep('identity', { realName: name.value.trim(), idCardNo: idCardNo.value.trim().toUpperCase() })
    showToast('身份资料已保存')
    router.replace('/auth')
  } catch (error) {
    showToast(error instanceof Error ? error.message : '保存失败')
  } finally {
    loading.value = false
  }
}
onMounted(async () => {
  try {
    const [profile, frontList, backList] = await Promise.all([
      api.profile(), api.mediaList('id_card_front'), api.mediaList('id_card_back'),
    ])
    name.value = profile.realName || ''
    idCardNo.value = profile.idCardNo || ''
    front.value = frontList.slice(0, 1).map(item => ({ url: item.url, mediaId: item.id, status: 'done' }))
    back.value = backList.slice(0, 1).map(item => ({ url: item.url, mediaId: item.id, status: 'done' }))
  } catch { showToast('身份资料加载失败') }
  finally { pageLoading.value = false }
})
</script>

<template>
  <main class="page identity-page">
    <PageNav title="身份认证" />
    <div v-if="pageLoading" class="identity-loading"><van-loading vertical>正在加载身份资料</van-loading></div>
    <template v-else>
      <header class="identity-intro">
        <span class="identity-intro__icon"><van-icon name="idcard" /></span>
        <div><h1>上传身份证</h1><p>请使用本人有效证件，确保四角完整、文字清晰</p></div>
      </header>

      <section class="identity-content">
        <div class="section-heading">
          <div><h2>证件照片</h2><p>依次上传人像面和国徽面</p></div>
          <span>{{ uploadedCount }}/2</span>
        </div>

        <div class="document-list">
          <article class="document-item">
            <div class="document-item__head"><b>身份证人像面</b><em :class="{ done: front[0]?.mediaId }">{{ front[0]?.mediaId ? '已上传' : '待上传' }}</em></div>
            <van-uploader v-model="front" class="document-uploader" :max-count="1" accept="image/*" reupload :after-read="item => upload(item, 'id_card_front')">
              <div class="document-placeholder document-placeholder--front">
                <img src="/images/id-card-back-guide.png" alt="身份证人像面上传示例" />
                <span class="document-mask" aria-hidden="true" />
                <span class="upload-trigger"><i><van-icon name="plus" /></i><b>点击上传证件照人像面</b></span>
              </div>
            </van-uploader>
            <p><van-icon name="passed" /> 头像、姓名和证件号码需清晰可见</p>
          </article>

          <article class="document-item">
            <div class="document-item__head"><b>身份证国徽面</b><em :class="{ done: back[0]?.mediaId }">{{ back[0]?.mediaId ? '已上传' : '待上传' }}</em></div>
            <van-uploader v-model="back" class="document-uploader" :max-count="1" accept="image/*" reupload :after-read="item => upload(item, 'id_card_back')">
              <div class="document-placeholder document-placeholder--back">
                <img src="/images/id-card-front-guide.webp" alt="身份证国徽面上传示例" />
                <span class="document-mask" aria-hidden="true" />
                <span class="upload-trigger"><i><van-icon name="plus" /></i><b>点击上传证件照国徽面</b></span>
              </div>
            </van-uploader>
            <p><van-icon name="passed" /> 国徽、有效期限和签发机关需清晰可见</p>
          </article>
        </div>

        <aside class="photo-guide">
          <van-icon name="info-o" />
          <div><b>拍摄要求</b><p>原件平放拍摄，请勿反光、裁边、遮挡或使用复印件。</p></div>
        </aside>
      </section>

      <van-form class="page-form identity-form" @submit="done">
        <section class="identity-content identity-fields">
          <div class="section-heading"><div><h2>确认身份信息</h2><p>请核对并填写证件上的真实信息</p></div></div>
          <van-cell-group inset>
            <van-field v-model.trim="name" label="真实姓名" placeholder="请输入身份证姓名" clearable :rules="[{required:true,message:'请输入真实姓名'}]" />
            <van-field
              v-model.trim="idCardNo"
              maxlength="18"
              label="身份证号"
              placeholder="请输入18位身份证号"
              clearable
              :rules="[{ required: true, message: '请输入身份证号' }, { validator: validateIdCard }]"
              @update:model-value="value => idCardNo = String(value).toUpperCase()"
            />
          </van-cell-group>
        </section>
        <div class="security-note"><van-icon name="shield-o" />证件信息将加密保存，仅用于身份核验和申请审核</div>
        <BottomActionBar><van-button block type="primary" native-type="submit" :loading="loading">确认并完成认证</van-button></BottomActionBar>
      </van-form>
    </template>
  </main>
</template>

<style scoped>
.identity-page { background: #f5f7fa; }
.identity-loading { display: grid; min-height: 62vh; place-items: center; color: var(--muted); }
.identity-intro { display: flex; gap: 14px; padding: 24px 20px 22px; color: #fff; background: linear-gradient(135deg, #1748bd, #2563eb); }
.identity-intro__icon { display: grid; flex: 0 0 46px; height: 46px; place-items: center; border: 1px solid rgba(255,255,255,.24); border-radius: 8px; background: rgba(255,255,255,.14); }
.identity-intro__icon .van-icon { font-size: 25px; }
.identity-intro h1 { margin: 1px 0 6px; font-size: 21px; line-height: 1.25; }
.identity-intro p { margin: 0; color: rgba(255,255,255,.82); font-size: 12px; line-height: 1.6; }
.identity-content { padding: 22px 16px 4px; }
.section-heading { display: flex; align-items: center; justify-content: space-between; margin: 0 2px 14px; }
.section-heading h2 { margin: 0 0 4px; color: #172033; font-size: 17px; }
.section-heading p { margin: 0; color: #7d8799; font-size: 11px; }
.section-heading > span { min-width: 40px; color: var(--brand); font-size: 13px; font-weight: 700; text-align: right; }
.document-list { display: grid; gap: 14px; }
.document-item { padding: 15px; border: 1px solid #e5eaf1; border-radius: 8px; background: #fff; box-shadow: 0 4px 16px rgba(31, 52, 86, .05); }
.document-item__head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.document-item__head b { color: #263247; font-size: 14px; }
.document-item__head em { padding: 3px 7px; border-radius: 4px; color: #8a94a5; background: #f1f3f6; font-size: 10px; font-style: normal; }
.document-item__head em.done { color: #087d6f; background: #e8f7f3; }
.document-item > p { display: flex; gap: 5px; align-items: center; margin: 10px 1px 0; color: #7d8799; font-size: 10px; }
.document-item > p .van-icon { color: #0f9f8f; font-size: 13px; }
.document-uploader, .document-uploader :deep(.van-uploader__wrapper), .document-uploader :deep(.van-uploader__input-wrapper) { display: block; width: 100%; }
.document-uploader :deep(.van-uploader__input) { z-index: 3; }
.document-uploader :deep(.van-uploader__preview) { width: 100%; margin: 0; }
.document-uploader :deep(.van-uploader__preview-image) { width: 100%; height: auto; aspect-ratio: 1.58 / 1; overflow: hidden; border-radius: 6px; }
.document-uploader :deep(.van-uploader__preview-delete) { width: 28px; height: 28px; border-radius: 0 6px 0 8px; background: rgba(23,32,51,.78); }
.document-uploader :deep(.van-uploader__preview-delete-icon) { top: 5px; right: 5px; font-size: 18px; }
.document-placeholder { position: relative; width: 100%; aspect-ratio: 1.58 / 1; overflow: hidden; border: 1px dashed #b8c8e2; border-radius: 7px; background: #f8faff; }
.document-placeholder > img { display: block; width: 100%; height: 100%; object-fit: cover; pointer-events: none; }
.document-mask { position: absolute; inset: 0; background: rgba(255, 255, 255, .72); backdrop-filter: blur(1.5px); }
.document-mask, .upload-trigger { pointer-events: none; }
.upload-trigger { position: absolute; z-index: 2; inset: 0; display: flex; flex-direction: column; gap: 10px; align-items: center; justify-content: center; color: #2563eb; }
.upload-trigger i { display: grid; width: 54px; height: 54px; place-items: center; border-radius: 50%; color: #fff; background: #3478ef; box-shadow: 0 8px 18px rgba(37, 99, 235, .22); font-size: 27px; font-style: normal; }
.upload-trigger b { font-size: 13px; font-weight: 700; }
.photo-guide { display: flex; gap: 10px; margin-top: 14px; padding: 12px; border-left: 3px solid #e89614; border-radius: 4px; color: #66542f; background: #fff8e8; }
.photo-guide > .van-icon { margin-top: 1px; color: #d98708; font-size: 16px; }
.photo-guide b { display: block; margin-bottom: 3px; font-size: 12px; }
.photo-guide p { margin: 0; font-size: 10px; line-height: 1.6; }
.identity-form { margin-top: 10px; }
.identity-fields :deep(.van-cell-group--inset) { margin: 0; overflow: hidden; border: 1px solid #e5eaf1; border-radius: 8px; }
.identity-fields :deep(.van-cell) { padding: 15px 14px; }
.identity-fields :deep(.van-field__label) { width: 76px; color: #303b50; font-weight: 600; }
.security-note { display: flex; gap: 6px; align-items: center; justify-content: center; padding: 14px 18px 0; color: #8a94a5; font-size: 10px; }
.security-note .van-icon { color: #0f9f8f; font-size: 14px; }
.identity-form :deep(.bottom-action-bar) { padding-top: 18px; }
.identity-form :deep(.bottom-action-bar::before) { display: none; }
.identity-form :deep(.van-button) { border-radius: 8px; font-weight: 700; }
@media (max-width: 340px) {
  .identity-intro { padding-right: 15px; padding-left: 15px; }
  .identity-content { padding-right: 12px; padding-left: 12px; }
  .identity-fields :deep(.van-field__label) { width: 68px; }
}
</style>
