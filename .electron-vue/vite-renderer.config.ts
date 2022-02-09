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
        port: pkg.env.port
    }
})
