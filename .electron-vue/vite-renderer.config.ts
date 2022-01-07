import { join, resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import pkg from '../package.json'

// https://cn.vitejs.dev/config/
export default defineConfig({
    mode: process.env.NODE_ENV,
    root: join(__dirname, '../src/renderer'),
    plugins: [vue()],
    base: './',
    resolve: {
        // alias: {
        //     '@': resolve(__dirname, '../src') // 路径别名
        // }
    },
    build: {
        emptyOutDir: true,
        outDir: '../../dist/renderer'
    },
    server: {
        host: pkg.env.host,
        port: pkg.env.port
    }
})
