<template>
    <div class="home-wrapper">
        <div>{{ userStore.fullname }}</div>
        <el-button @click="onClick()">返回</el-button>
    </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/modules/user'
import { useRouter } from 'vue-router'

const router = useRouter()

// localStorage.clear()
const userStore = useUserStore()
// console.log('fullname : ', userStore.fullname)

const onClick = () => {
    router.push({ path: '/' })
}

// end
</script>

<style lang="scss" scoped>
.home-wrapper {
    height: 100%;
    border-top: 1px solid #ddd;

    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
}
</style>
