<script lang="ts" setup>
import { h, onMounted, onUnmounted } from "vue"
import { useTheme } from "@/hooks/useTheme"
import { ElNotification } from "element-plus"
import zhCn from "element-plus/lib/locale/lang/zh-cn"
const { webFrame } = require("electron")

const { initTheme } = useTheme()

/** 初始化主题 */
initTheme()
/** 将 Element Plus 的语言设置为中文 */
const locale = zhCn

ElNotification({
  title: "Hello",
  message: h(
    "a",
    { style: "color: teal", target: "_blank", href: "https://github.com/un-pany/v3-admin-vite" },
    "小项目获取 star 不易，如果你喜欢这个项目的话，欢迎点击这里支持一个 star ！这是作者持续维护的唯一动力（小声：毕竟是免费的）"
  ),
  duration: 0,
  position: "bottom-right"
})

onMounted(() => {
  window.vIpcRenderer.on("zoom_win", (e, scale: number) => webFrame.setZoomFactor(scale))
  const params = {
    width: 1200,
    height: 800,
    center: true,
    maxable: true,
    resizable: true
  }
  window.vIpcRenderer.send("set_win_size", params)
  /** 打印 应用标题与版本号 */
  window.vIpcRenderer.send("query_title")
  window.vIpcRenderer.on("get_title", (e: any, args: string) => {
    const style1 = "color: #fff; background: #41b883; padding: 4px; border-radius: 4px;"
    const style2 = "color: #fff; background: #409EFF; padding: 4px 8px; border-radius: 4px;"
    console.log(`%c Hi! %c${args}@v${window.vRemote.getGlobal("version")}`, style1, style2)
  })
})
onUnmounted(() => {
  window.vIpcRenderer.removeAllListeners("zoom_win")
  window.vIpcRenderer.removeAllListeners("get_title")
})

// end
</script>

<template>
  <ElConfigProvider :locale="locale">
    <router-view />
  </ElConfigProvider>
</template>
