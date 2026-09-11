<script setup lang="ts">defineProps<{title:string;right?:string}>();defineEmits<{right:[]}>()</script>
<template><van-nav-bar :title="title" left-arrow fixed placeholder safe-area-inset-top @click-left="$router.back()" @click-right="$emit('right')"><template v-if="right" #right>{{right}}</template></van-nav-bar></template>
