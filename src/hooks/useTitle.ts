import { ref, watch } from "vue"

/** 项目标题 */
export const APP_TITLE = import.meta.env.VITE_APP_TITLE ?? "V3 Electron Vite"

/** 动态标题 */
const dynamicTitle = ref<string>("")

/** 设置标题 */
const setTitle = (title?: string) => {
  dynamicTitle.value = title ? `${APP_TITLE} | ${title}` : APP_TITLE
}

/** 监听标题变化 */
watch(dynamicTitle, (value, oldValue) => {
  if (document && value !== oldValue) {
    document.title = value
  }
})

export function useTitle() {
  return { setTitle }
}
