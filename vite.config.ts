import { rmSync } from "fs"
import { resolve } from "path"
import { defineConfig } from "vite"
import { createSvgIconsPlugin } from "vite-plugin-svg-icons"
import vue from "@vitejs/plugin-vue"
import UnoCSS from "unocss/vite"
import vueJsx from "@vitejs/plugin-vue-jsx"
import svgLoader from "vite-svg-loader"
import electron from "vite-electron-plugin"
import pkg from "./package.json"

/** 清空dist */
rmSync("dist", { recursive: true, force: true })

// https://vitejs.dev/config/
export default defineConfig({
  clearScreen: false,
  server: {
    /** 是否自动打开浏览器 */
    open: false, // true false
    host: pkg.env.host,
    port: pkg.env.port
  },
  plugins: [
    vue(),
    vueJsx(),
    /** 将 SVG 静态图转化为 Vue 组件 */
    svgLoader({ defaultImport: "url" }),
    UnoCSS(),
    /** SVG 插件 */
    createSvgIconsPlugin({
      // Specify the icon folder to be cached
      iconDirs: [resolve(process.cwd(), "./src/icons/svg")],
      // Specify symbolId format
      symbolId: "icon-[dir]-[name]",
      inject: "body-first"
    }),
    electron({
      outDir: "dist",
      include: ["script"],
      transformOptions: {
        sourcemap: false
      }
    })
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src") // 路径别名
    }
  },
  css: {
    postcss: {
      plugins: [
        {
          postcssPlugin: "internal:charset-removal",
          AtRule: {
            charset: (atRule) => {
              if (atRule.name === "charset") {
                atRule.remove()
              }
            }
          }
        }
      ]
    }
  },
  build: {
    /** 消除打包大小超过 ?kb 警告 */
    chunkSizeWarningLimit: 2048,
    /** 禁用 gzip 压缩大小报告 */
    reportCompressedSize: false,
    rollupOptions: {
      output: {
        /**
         * 分块策略
         * 1. 注意这些包名必须存在，否则打包会报错
         * 2. 如果你不想自定义 chunk 分割策略，可以直接移除这段配置
         */
        manualChunks: {
          vue: ["vue", "vue-router", "pinia"],
          element: ["element-plus", "@element-plus/icons-vue"],
          vxe: ["vxe-table", "vxe-table-plugin-element", "xe-utils"]
        }
      }
    }
  },
  /** 混淆器 */
  esbuild: {
    // /** 打包时移除 console.log */
    // pure: ["console.log"],
    /** 打包时移除 debugger */
    drop: ["debugger"],
    /** 打包时移除所有注释 */
    legalComments: "none"
  }
})
