<script lang="ts" setup>
import { h, onMounted } from "vue"
import { useTheme } from "@/hooks/useTheme"
import { ElNotification } from "element-plus"
import zhCn from "element-plus/lib/locale/lang/zh-cn"
const { webFrame } = require("electron")

onMounted(() => {
  window.vIpcRenderer.once("zoom_win", (_, scale: number) => webFrame.setZoomFactor(scale))
  window.vIpcRenderer.once("get_title", (_, args: string) => {
    const style1 = "color: #fff; background: #41b883; padding: 4px; border-radius: 4px;"
    const style2 = "color: #fff; background: #409EFF; padding: 4px 8px; border-radius: 4px;"
    console.log(`%c Hi! %c${args}@v${window.vRemote.getGlobal("version")}`, style1, style2)
  })
  /** 设置窗口 */
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
})

/** 初始化主题 */
const { initTheme } = useTheme()
initTheme()
/** 将 Element Plus 的语言设置为中文 */
const locale = zhCn
/** 欢迎 star 标语 */
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

// end
</script>

<template>
  <ElConfigProvider :locale="locale">
    <router-view />
  </ElConfigProvider>
</template>
