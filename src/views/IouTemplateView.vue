<script setup lang="ts">
import { showImagePreview, showSuccessToast } from 'vant'
import iouTemplateUrl from '../assets/iou-template.png'
import PageNav from '../components/PageNav.vue'

const previewTemplate = () => showImagePreview({
  images: [iouTemplateUrl],
  closeable: true,
  closeOnPopstate: true,
  maxZoom: 5,
})

const saveTemplate = () => {
  const link = document.createElement('a')
  link.href = iouTemplateUrl
  link.download = '借条参考模板.png'
  link.click()
  showSuccessToast('模板图片已保存')
}
</script>

<template>
  <main class="page">
    <PageNav title="借条参考模板" />
    <van-tabs color="#2563eb">
      <van-tab title="图片模板">
        <button class="template-paper" type="button" aria-label="放大查看借条参考模板" @click="previewTemplate">
          <img :src="iouTemplateUrl" alt="借条参考模板" />
          <span class="template-zoom"><van-icon name="expand-o" /> 点击放大</span>
        </button>
      </van-tab>
      <van-tab title="视频示例">
        <van-empty image="network" description="视频模板为原型占位">
          <van-button size="small" type="primary" icon="play-circle-o">播放示例</van-button>
        </van-empty>
      </van-tab>
    </van-tabs>
    <van-notice-bar wrapable left-icon="info-o" text="本模板仅供材料展示参考，不代表法律意见或放款承诺。" />
    <section class="original-template-list">
      <h2>空白原模板</h2>
      <p>不带填写内容，可在线查看或下载 Word 文件</p>
      <van-cell title="借条原模板" label="借款金额、期限及双方签字栏" value="查看" icon="description-o" clickable is-link to="/document-template/iou" />
      <van-cell title="借款免责协议原模板" label="双方责任及签字信息栏" value="查看" icon="shield-o" clickable is-link to="/document-template/disclaimer" />
    </section>
    <BottomActionBar>
      <van-button round block type="primary" icon="down" @click="saveTemplate">
        保存模板
      </van-button>
    </BottomActionBar>
  </main>
</template>
