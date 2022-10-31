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

app.use(store).use(router).mount("#app")

/** 打印 应用标题与版本号 */
window.$ipcRenderer.send("query_title")
window.$ipcRenderer.on("get_title", (e: Electron.IpcRendererEvent, args: string) => {
  const style1 = "color: #fff; background: #41b883; padding: 4px; border-radius: 4px;"
  const style2 = "color: #fff; background: #409EFF; padding: 4px 8px; border-radius: 4px;"
  console.log(`%c Hi! %c${args}@v${window.$remote.getGlobal("version")}`, style1, style2)
})
// window.$fs.readdir(".", (err, list) => console.log(err, list))
