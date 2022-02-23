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
    define: {
        process: {
            env: process.env
        }
    },
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
            // '/': {
            //     target: 'http://172.23.26.65:20002/api',
            //     changeOrigin: true
            //     // rewrite: (path) => {
            //     //     console.log('proxy', path)
            //     //     return 'http://172.23.26.65:20002/api'
            //     // }
            // }
        }
    }
})
