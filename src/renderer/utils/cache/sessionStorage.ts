/** 统一处理 Cookie */

import CacheKey from "@/constants/cacheKey"

export const getToken = () => {
  return sessionStorage.getItem(CacheKey.TOKEN)
}
export const setToken = (token: string) => {
  sessionStorage.setItem(CacheKey.TOKEN, token)
}
export const removeToken = () => {
  sessionStorage.removeItem(CacheKey.TOKEN)
}
