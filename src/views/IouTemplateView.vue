<script setup lang="ts">
import { showToast } from 'vant'
import iouTemplateUrl from '../assets/iou-template.png'
import PageNav from '../components/PageNav.vue'
</script>

<template>
  <main class="page">
    <PageNav title="借条参考模板" />
    <van-tabs color="#2563eb">
      <van-tab title="图片模板">
        <figure class="template-paper">
          <img :src="iouTemplateUrl" alt="借条参考模板" />
        </figure>
      </van-tab>
      <van-tab title="视频示例">
        <van-empty image="network" description="视频模板为原型占位">
          <van-button size="small" type="primary" icon="play-circle-o">播放示例</van-button>
        </van-empty>
      </van-tab>
    </van-tabs>
    <van-notice-bar wrapable left-icon="info-o" text="本模板仅供材料展示参考，不代表法律意见或放款承诺。" />
    <BottomActionBar>
      <van-button round block type="primary" icon="down" @click="showToast('模板已模拟保存')">
        保存模板
      </van-button>
    </BottomActionBar>
  </main>
</template>
