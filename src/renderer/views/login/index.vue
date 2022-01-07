<template>
    <div class="app-login">
        <img src="../../assets/image/vite.jpeg" alt="logo" />
        <div>Hello world!</div>
        <el-button @click="onClick()">点击跳转</el-button>
    </div>
</template>

<script setup lang="ts">
// import { onBeforeUpdate, onBeforeUnmount } from 'vue'
import { store } from '../../store'
import { useRouter } from 'vue-router'

console.log(store.state.user)

const router = useRouter()

const onClick = () => {
    const value = Math.random() * 1000
    LOGGER.info(value)
    store.dispatch('user/setName', '' + value)
    router.push({ path: '/home' })
}

// console.log(remote.getGlobal('loginSize'))
// window.remote.getGlobal('loginSize')
</script>

<style lang="scss" scoped>
.app-login {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;

    text-align: center;
    background-color: #eee;
}
</style>
