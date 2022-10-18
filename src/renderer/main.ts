// core
import { createApp } from "vue"
import App from "@/App.vue"
import store from "@/store"
import router from "@/router"
import "@/router/permission"
// load
import { loadSvg } from "@/icons"
import { loadPlugins } from "@/plugins"
import { loadDirectives } from "@/directives"
// css
import "uno.css" // ./views/unocss 页面不生效时，F5刷新页面即可
import "normalize.css"
import "element-plus/dist/index.css"
import "element-plus/theme-chalk/dark/css-vars.css"
import "@/styles/index.scss"

const app = createApp(App)

/** 加载插件 */
loadPlugins(app)
/** 加载全局 SVG */
loadSvg(app)
/** 加载自定义指令 */
loadDirectives(app)

app.use(store).use(router).mount("#app")

/** 是否以浏览器打开 */
window.$IsWeb = !window.navigator.userAgent.includes("Electron")

if (import.meta.env.DEV) {
  const style1 = "color: #fff; background: #41b883; padding: 4px; border-radius: 4px;"
  const style2 = "color: #fff; background: #409EFF; padding: 4px 8px; border-radius: 4px;"
  console.log(`%c Hi! %c${document.title}`, style1, style2, window.origin)
}
