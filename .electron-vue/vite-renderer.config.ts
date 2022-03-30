import { join, resolve } from 'path'
import { defineConfig } from 'vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import vue from '@vitejs/plugin-vue'
import pkg from '../package.json'

// https://cn.vitejs.dev/config/
export default defineConfig({
    mode: process.env.NODE_ENV,
    root: join(__dirname, '../src/renderer'),
    plugins: [
        vue(),
        // SVG 插件
        createSvgIconsPlugin({
            // Specify the icon folder to be cached
            iconDirs: [resolve(process.cwd(), './src/renderer/assets/svg')],
            // Specify symbolId format
            symbolId: 'icon-[dir]-[name]',
            inject: 'body-first'
        })
    ],
    base: './',
    define: {},
    resolve: {
        alias: {
            '@': resolve(__dirname, '../src/renderer') // 路径别名
        }
    },
    css: {
        postcss: {
            plugins: [
                {
                    postcssPlugin: 'internal:charset-removal',
                    AtRule: {
                        charset: (atRule) => {
                            if (atRule.name === 'charset') {
                                atRule.remove()
                            }
                        }
                    }
                }
            ]
        }
    },
    build: {
        emptyOutDir: true,
        outDir: '../../dist/renderer',
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        return id.toString().split('node_modules/')[1].split('/')[0].toString()
                    }
                }
            }
        }
    },
    server: {
        host: pkg.env.host,
        port: pkg.env.port,
        proxy: {
            // 注意：
            // 1. 由于在 renderer 目录下创建了 api 文件夹存放各种请求，
            //    在引用 @/api/xxx.ts 文件时, 也会被系统识别而造成页面无法渲染,
            //    所以 key 不使用 '/api/', 或者在 renderer 目录下不创建 api 文件夹
            // 2. 打包后，请求协议将由 http 变为 file,
            //    如果使用代理, 将请求失败, 目前尚无解决方案，所以不建议使用代理设置
            // '/api/v1': {
            //     changeOrigin: true,
            //     target: 'http://172.23.26.65:20002'
            //     // rewrite: (path) => {
            //     //     console.log('rewrite: ', path)
            //     //     return path.replace(/\/api\/v1/, '')
            //     // }
            // }
        }
    }
})
