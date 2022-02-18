<template>
    <div>
        <el-button @click="onClick()">返回</el-button>
    </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/modules/user'
import { useRouter } from 'vue-router'

// localStorage.clear()
const userStore = useUserStore()
userStore.update('李四')
console.log(userStore.name)

const router = useRouter()

const onClick = () => {
    router.push({ path: '/' })
}
</script>

<style lang="scss" scoped></style>
