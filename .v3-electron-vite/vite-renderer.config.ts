import { join, resolve } from "path"
import { defineConfig } from "vite"
import { createSvgIconsPlugin } from "vite-plugin-svg-icons"
import svgLoader from "vite-svg-loader"
import UnoCSS from "unocss/vite"
import vue from "@vitejs/plugin-vue"
import pkg from "../package.json"

// https://cn.vitejs.dev/config/
export default defineConfig({
  mode: process.env.NODE_ENV,
  root: join(__dirname, "../src/renderer"),
  plugins: [
    vue(),
    /** 将 SVG 静态图转化为 Vue 组件 */
    svgLoader(),
    UnoCSS(),
    /** SVG 插件 */
    createSvgIconsPlugin({
      // Specify the icon folder to be cached
      iconDirs: [resolve(process.cwd(), "./src/renderer/icons/svg")],
      // Specify symbolId format
      symbolId: "icon-[dir]-[name]",
      inject: "body-first"
    })
  ],
  base: "./",
  define: {},
  resolve: {
    alias: {
      "@": resolve(__dirname, "../src/renderer") // 路径别名
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
    // preprocessorOptions: {
    //     scss: {
    //         // additionalData: '@import "@/styles/variables.scss";'
    //     }
    // }
  },
  build: {
    emptyOutDir: true,
    outDir: "../../dist/renderer",
    /** 消除打包大小超过 500kb 警告 */
    chunkSizeWarningLimit: 1000,
    /** vite 2.6.x 以上需要配置 minify: terser，terserOptions 才能生效 */
    minify: "terser",
    /** 在 build 代码时移除 console.log、debugger 和 注释 */
    terserOptions: {
      compress: {
        drop_console: false,
        drop_debugger: true,
        pure_funcs: ["console.log"]
      },
      output: {
        /** 删除注释 */
        comments: false
      }
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id.toString().split("node_modules/")[1].split("/")[0].toString()
          }
        }
      }
    }
  },
  server: {
    /** 是否自动打开浏览器 */
    open: false, // true false
    host: pkg.env.host,
    port: pkg.env.port
  }
})
