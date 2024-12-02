<script lang="ts" setup>
import { onMounted } from "vue"
import { ElNotification } from "element-plus"
import { useGreyAndColorWeakness } from "@/hooks/useGreyAndColorWeakness"
import zhCn from "element-plus/es/locale/lang/zh-cn" // Element Plus 中文包
import IpcDict from "@/constants/ipc-dict"
import { useTheme } from "@/hooks/useTheme"
import { APP_TITLE } from "@/hooks/useTitle"

const { initTheme } = useTheme()
const { initGreyAndColorWeakness } = useGreyAndColorWeakness()

/** 初始化主题 */
initTheme()
/** 初始化灰色模式和色弱模式 */
initGreyAndColorWeakness()

/** 作者小心思 */
ElNotification({
  title: "Hello",
  type: "success",
  dangerouslyUseHTMLString: true,
  message: `<a style='color: teal' target='_blank' href='https://github.com/un-pany/v3-admin-vite'>小项目获取 star 不易，如果你喜欢这个项目的话，欢迎点击这里支持一个 star ！这是作者持续维护的唯一动力（小声：毕竟是免费的）</a>`,
  // duration: 0,
  position: "bottom-right"
})

onMounted(() => {
  console.log(`Hello, ${APP_TITLE}! \n`)
  const winState: WinStateDTO = {
    width: 1024,
    height: 768,
    center: true,
    maxable: true,
    resizable: true
  }
  window.vIpcRenderer.send(IpcDict.CODE_01001, winState)
})
</script>

<template>
  <el-config-provider :locale="zhCn">
    <router-view />
  </el-config-provider>
</template>
