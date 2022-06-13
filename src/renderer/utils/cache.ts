import Keys from '@/constant/key'

export const getSidebarStatus = () => localStorage.getItem(Keys.sidebarStatus)
export const setSidebarStatus = (sidebarStatus: string) => localStorage.setItem(Keys.sidebarStatus, sidebarStatus)

export const getToken = () => localStorage.getItem(Keys.token)
export const setToken = (token: string) => localStorage.setItem(Keys.token, token)
export const removeToken = () => localStorage.removeItem(Keys.token)

export const getActiveThemeName = () => localStorage.getItem(Keys.activeThemeName)
export const setActiveThemeName = (themeName: string) => {
    localStorage.setItem(Keys.activeThemeName, themeName)
}
