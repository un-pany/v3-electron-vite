<template>
    <div>
        <el-button @click="onClick()">返回</el-button>
    </div>
</template>

<script setup lang="ts">
// import { onBeforeUpdate, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

localStorage.clear()

const router = useRouter()

const onClick = () => {
    router.push({ path: '/' })
}
</script>

<style lang="scss" scoped></style>
