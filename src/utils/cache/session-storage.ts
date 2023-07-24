/** 统一处理 sessionStorage */

import CacheKey from "@/constants/cache-key"

export const getToken = () => {
  return sessionStorage.getItem(CacheKey.TOKEN)
}
export const setToken = (token: string) => {
  sessionStorage.setItem(CacheKey.TOKEN, token)
}
export const removeToken = () => {
  sessionStorage.removeItem(CacheKey.TOKEN)
}
