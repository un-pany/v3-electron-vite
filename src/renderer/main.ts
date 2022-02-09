import './styles/index.scss' // global css

import App from './App.vue'
import router from './router'
import { store } from './store'
import { createApp } from 'vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import SvgIcon from '@/components/svg-icon/index.vue'

const app = createApp(App)
app.component('SvgIcon', SvgIcon) // 全局注册icon-svg

app.use(ElementPlus)
app.use(store).use(router).mount('body')
