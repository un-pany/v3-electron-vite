/** cookies 封装 */

import Keys from '@/constant/key'

export const getSidebarStatus = () => sessionStorage.getItem(Keys.sidebarStatus)
export const setSidebarStatus = (sidebarStatus: string) => sessionStorage.setItem(Keys.sidebarStatus, sidebarStatus)

export const getToken = () => sessionStorage.getItem(Keys.token)
export const setToken = (token: string) => sessionStorage.setItem(Keys.token, token)
export const removeToken = () => sessionStorage.removeItem(Keys.token)

export const getActiveThemeName = () => sessionStorage.getItem(Keys.activeThemeName)
export const setActiveThemeName = (themeName: string) => {
    sessionStorage.setItem(Keys.activeThemeName, themeName)
}
