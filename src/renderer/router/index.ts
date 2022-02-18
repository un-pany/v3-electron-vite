import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

// 常驻路由
export const constantRoutes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Login',
        component: () => import('@/views/login/index.vue')
    },
    {
        path: '/home',
        name: 'Home',
        component: () => import('@/views/home/index.vue')
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes: constantRoutes
})

export default router
