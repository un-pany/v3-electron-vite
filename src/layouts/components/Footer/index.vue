<script lang="ts" setup>
import { APP_TITLE } from "@/hooks/useTitle"
</script>

<template>
  <footer class="layout-footer">MIT © 2021-PRESENT {{ APP_TITLE }}</footer>
</template>

<style lang="scss" scoped>
.layout-footer {
  width: 100%;
  min-height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--el-text-color-placeholder);
}
</style>
