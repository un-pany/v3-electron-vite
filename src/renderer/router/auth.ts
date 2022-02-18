// 鉴权

import { RouteLocationNormalized } from 'vue-router'
import router from './index'

router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: Function) => {
    // console.log('to', to)
    // console.log('from', from)
    next()
})
