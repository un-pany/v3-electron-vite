import "./utils/with-prototype"
// core
import App from "@/App.vue"
import { createApp } from "vue"
import { pinia } from "@/store"
import { router } from "@/router"
import "@/router/permission"
// load
import { loadSvg } from "@/icons"
import { loadPlugins } from "@/plugins"
import { loadDirectives } from "@/directives"
// css
import "uno.css"
import "normalize.css"
import "element-plus/dist/index.css"
import "element-plus/theme-chalk/dark/css-vars.css"
import "vxe-table/lib/style.css"
import "vxe-table-plugin-element/dist/style.css"
import "@/styles/index.scss"

const app = createApp(App)

/** 加载插件 */
loadPlugins(app)
/** 加载全局 SVG */
loadSvg(app)
/** 加载自定义指令 */
loadDirectives(app)

app.use(pinia).use(router)
router.isReady().then(() => app.mount("#app"))

//#region 冻结自定义属性
try {
  const customProps = ["vRemote", "vIpcRenderer", "vLog"]
  customProps.forEach((prop) => {
    Object.defineProperty(window, prop, {
      writable: false,
      configurable: false
    })
  })
} catch (reason: any) {
  console.error("[禁止修改自定义属性]", reason)
}
//#endregion
