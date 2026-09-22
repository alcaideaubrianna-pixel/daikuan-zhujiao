<template>
  <footer class="bottom-action-bar">
    <slot />
  </footer>
</template>

<style scoped>
.bottom-action-bar {
  width: 100%;
  margin-top: auto;
  padding: 24px 16px max(18px, env(safe-area-inset-bottom));
}

.bottom-action-bar::before {
  display: block;
  height: 1px;
  margin: 0 -16px 16px;
  background: var(--line);
  content: '';
}

.bottom-action-bar :deep(.van-button) {
  min-height: 44px;
}
</style>
