import './styles/index.scss' // global css

import App from './App.vue'
import store from './store'
import router from './router'
import { createApp } from 'vue'

import '@/router/auth' // 鉴权

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// svg
import 'virtual:svg-icons-register'
import SvgIcon from '@/components/svg-icon/index.vue'

window.$axiosCache = new Map() // 请求标识 => 取消函数

const app = createApp(App)
app.component('SvgIcon', SvgIcon) // 全局注册 icon-svg

app.use(ElementPlus)
app.use(store).use(router).mount('#main')
