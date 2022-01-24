<template>
    <div class="login-wrapper">
        <!--  -->
        <div class="login-card">
            <!--  -->
            <div class="login-logo">
                <img src="@/assets/image/vite.png" alt="vite" />
                <span>v3-electron</span>
            </div>

            <!-- 登录表单 -->
            <el-form ref="loginFormRef" :model="loginForm" :rules="loginRule" @keyup.enter="onLogin()">
                <!-- 用户名 -->
                <el-form-item prop="username">
                    <img src="@/assets/image/user.png" />
                    <el-input v-model="loginForm.username" :spellcheck="false" placeholder="请输入用户名" tabindex="1" />
                </el-form-item>

                <!-- 密码 -->
                <el-form-item prop="password">
                    <img src="@/assets/image/password.png" />
                    <el-input v-model="loginForm.password" :spellcheck="false" placeholder="请输入密码" tabindex="2" show-password />
                </el-form-item>

                <!-- 验证码 -->
                <div class="captcha-container">
                    <el-form-item prop="captcha">
                        <img src="@/assets/image/password.png" />
                        <el-input v-model="loginForm.captcha" :spellcheck="false" placeholder="请输入验证码" tabindex="3" />
                    </el-form-item>
                    <img src="@/assets/image/captcha.png" class="captcha" />
                </div>

                <!-- 登录按钮 -->
                <el-button type="primary" tabindex="4" class="login-button" @click="onLogin()">登&nbsp;&nbsp;&nbsp;&nbsp;录</el-button>
            </el-form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { store } from '@/store'
import { useRouter } from 'vue-router'
import { reactive, ref } from 'vue'

// console.log(store.state.user)

const router = useRouter()
const loading = ref<boolean>(false)
const loginFormRef = ref<any>()

/**
 * 登录表单
 */
interface iLoginForm {
    username: string
    password: string
    captcha: string
}
const loginForm = reactive<iLoginForm>({
    username: '',
    password: '',
    captcha: ''
})

/**
 * 校验规则
 */
interface iLoginRule {
    username: any[]
    password: any[]
    captcha: any[]
}
const validateFactory = (text) => ({
    required: true,
    trigger: ['blur', 'change'],
    validator: (rule, value, callback) => (value ? callback() : callback(new Error(text)))
})
const loginRule = reactive<iLoginRule>({
    username: [validateFactory('请输入用户名')],
    password: [validateFactory('请输入密码')],
    captcha: [validateFactory('请输入验证码')]
})

// 登录
const onLogin = () => {
    if (loading.value) return
    loginFormRef.value.validate((valid) => {
        if (!valid) return
        loading.value = true
        router.push({ path: '/home' })
    })
}

//
</script>

<style lang="scss" scoped>
.login-wrapper {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;

    width: 100%;
    height: 100%;
    overflow: hidden;
    background: url('@/assets/image/background.png') center/cover no-repeat;

    .login-card {
        width: 500px;
        padding: 20px 40px 40px;
        // border: 1px solid red;
    }

    .login-logo {
        display: flex;
        align-items: center;
        justify-content: center;

        color: #fff;
        font-size: 40px;
        margin-bottom: 40px;

        img {
            width: 80px;
            height: 80px;
            margin-right: 10px;
        }
    }

    img {
        -webkit-user-drag: none;
    }
}

.el-form {
    text-align: center;
    --el-font-size-base: 16px;

    &-item {
        margin-bottom: 32px;
    }

    .captcha-container {
        width: 100%;
        position: relative;
        margin-bottom: 32px;

        display: flex;
        align-items: center;
        justify-content: center;

        .el-form-item {
            margin-bottom: 0;
        }

        .captcha {
            width: 160px;
            height: 100%;
            margin-left: 20px;
        }
    }
}

:deep(.el-form-item__content) {
    padding: 10px 20px;
    flex-wrap: nowrap;
    border-radius: 8px;
    background-color: rgba(247, 248, 248, 1);

    img {
        width: 28px;
        height: 24px;
    }

    .el-input .el-input__inner {
        border: 0;
        border-radius: 0px;
        background-color: transparent;

        &:focus {
            color: #7879f1;
        }
    }
}
:deep(.el-input__validateIcon) {
    display: none !important;
}
:deep(.el-form-item__error) {
    margin-left: 57px;
}

.login-button {
    width: 100%;
    height: 40px;
}
</style>
