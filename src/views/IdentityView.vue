<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import PageNav from '../components/PageNav.vue'
import { api } from '../api/client'
import { useLoanStore } from '../stores/loan'
import { isValidChineseIdCard } from '../utils/idCard'

type UploadItem = {
  file?: File
  url?: string
  mediaId?: number
  status?: '' | 'uploading' | 'failed' | 'done'
  message?: string
  isImage?: boolean
}

const router = useRouter()
const store = useLoanStore()
const name = ref('')
const idCardNo = ref('')
const frontFiles = ref<UploadItem[]>([])
const backFiles = ref<UploadItem[]>([])
const submitting = ref(false)
const idCardError = computed(() => {
  if (!idCardNo.value) return ''
  return isValidChineseIdCard(idCardNo.value) ? '' : '请输入正确的18位身份证号'
})

const upload = async (item: UploadItem | UploadItem[], purpose: string) => {
  const current = Array.isArray(item) ? item[0] : item
  if (!current?.file) return
  current.status = 'uploading'
  current.message = '上传中'
  try {
    const media = await api.uploadMedia(current.file, purpose)
    Object.assign(current, { url: media.url, mediaId: media.id, status: 'done', message: '' })
  } catch (error) {
    current.status = 'failed'
    current.message = error instanceof Error ? error.message : '上传失败'
  }
}

const done = async () => {
  const realName = name.value.trim()
  if (!frontFiles.value.some(item => item.status === 'done' || item.mediaId)) return showToast('请上传身份证人像面')
  if (!backFiles.value.some(item => item.status === 'done' || item.mediaId)) return showToast('请上传身份证国徽面')
  if (!realName) return showToast('请输入真实姓名')
  if (!isValidChineseIdCard(idCardNo.value)) return showToast('请输入正确的身份证号')

  submitting.value = true
  try {
    await api.saveProfileStep('identity', { realName, idCardNo: idCardNo.value.trim().toUpperCase() })
    store.complete('identity')
    showToast('身份认证已保存')
    router.replace('/auth')
  } catch (error) {
    showToast(error instanceof Error ? error.message : '保存失败')
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  try {
    const [profile, front, back] = await Promise.all([
      api.profile(),
      api.mediaList('id_card_front'),
      api.mediaList('id_card_back'),
    ])
    name.value = String(profile.realName || '')
    idCardNo.value = String(profile.idCardNo || '')
    const toUploadItem = (item: Record<string, any>): UploadItem => ({
      url: item.url,
      mediaId: item.id,
      status: 'done',
      isImage: true,
    })
    frontFiles.value = front.slice(0, 1).map(toUploadItem)
    backFiles.value = back.slice(0, 1).map(toUploadItem)
  } catch {
    // The form remains usable when previously saved data cannot be loaded.
  }
})
</script>

<template>
  <main class="page">
    <PageNav title="身份认证" />
    <van-notice-bar left-icon="shield-o" text="信息仅用于本次额度评估演示，请确认由本人操作" />
    <section class="upload-panel">
      <h2>上传身份证</h2>
      <p>请确保证件完整、清晰、无遮挡</p>
      <div class="id-grid">
        <div class="id-upload-item">
          <van-uploader
            v-model="frontFiles"
            :max-count="1"
            accept="image/*"
            reupload
            :after-read="item => upload(item, 'id_card_front')"
          >
            <div class="id-placeholder"><van-icon name="photograph" /><b>身份证人像面</b></div>
          </van-uploader>
          <span>人像面</span>
        </div>
        <div class="id-upload-item">
          <van-uploader
            v-model="backFiles"
            :max-count="1"
            accept="image/*"
            reupload
            :after-read="item => upload(item, 'id_card_back')"
          >
            <div class="id-placeholder"><van-icon name="photograph" /><b>身份证国徽面</b></div>
          </van-uploader>
          <span>国徽面</span>
        </div>
      </div>
    </section>
    <van-cell-group inset>
      <van-field v-model.trim="name" label="真实姓名" placeholder="请输入本人姓名" maxlength="30" />
      <van-field
        v-model.trim="idCardNo"
        label="身份证号"
        placeholder="请输入18位身份证号"
        maxlength="18"
        clearable
        :error-message="idCardError"
        @update:model-value="value => idCardNo = String(value).toUpperCase()"
      />
    </van-cell-group>
    <BottomActionBar>
      <van-button round block type="primary" :loading="submitting" loading-text="提交中" @click="done">确认并完成认证</van-button>
    </BottomActionBar>
  </main>
</template>
