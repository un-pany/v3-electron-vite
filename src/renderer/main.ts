import './styles/index.scss' // global css

import App from './App.vue'
import router from './router'
import { store } from './store'
import { createApp } from 'vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// console.log('window', window)

const app = createApp(App)
app.use(ElementPlus)

app.use(store).use(router).mount('body')
