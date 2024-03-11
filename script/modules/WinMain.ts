/**
 * 主窗口
 */

import { ipcMain, BrowserWindow, type BrowserWindowConstructorOptions } from "electron"
import * as remote from "@electron/remote/main"
import GlobalConfig from "./GlobalConfig"
import { mainLog } from "../utils/logger"

class WinMain {
  /** 窗口实例 */
  private static WIN_INST: BrowserWindow | null = null

  /** 窗口配置 */
  private static WIN_CONFIG: BrowserWindowConstructorOptions = {
    icon: GlobalConfig.APP_LOGO, // 图标
    title: GlobalConfig.getAppTitle(), // 如果由 loadURL() 加载的 HTML 文件中含有标签 <title>，此属性将被忽略
    minWidth: 500,
    minHeight: 400,
    show: false, // 是否在创建时显示, 默认值为 true
    frame: true, // 是否有边框
    center: true, // 是否在屏幕居中
    hasShadow: false, // 窗口是否有阴影. 默认值为 true
    resizable: true, // 是否允许拉伸大小
    fullscreenable: true, // 是否允许全屏，为 false 则插件 screenfull 不起作用
    autoHideMenuBar: true, // 自动隐藏菜单栏, 除非按了 Alt 键, 默认值为 false
    backgroundColor: "#fff", // 背景颜色
    webPreferences: {
      spellcheck: false, // 禁用拼写检查器
      disableBlinkFeatures: "SourceMap", // 以 "," 分隔的禁用特性列表
      devTools: true, // 是否开启 DevTools, 如果设置为 false（默认值为 true）, 则无法使用 BrowserWindow.webContents.openDevTools()
      webSecurity: false, // 当设置为 false, 将禁用同源策略
      nodeIntegration: true, // 是否启用 Node 集成
      contextIsolation: false, // 是否在独立 JavaScript 环境中运行 Electron API 和指定的 preload 脚本，默认为 true
      backgroundThrottling: false, // 是否在页面成为背景时限制动画和计时器，默认值为 true
      nodeIntegrationInWorker: true // 是否在 Web 工作器中启用了 Node 集成
    }
  }

  /** 获取窗口实例 */
  static getWinInst() {
    return this.WIN_INST
  }

  /** 显示窗口 */
  static show(key?: string, center?: boolean) {
    mainLog.log("[show main win] ", key)
    this.WIN_INST?.show()
    this.WIN_INST?.focus()
    center && this.WIN_INST?.center()
  }

  /** 创建窗口 */
  static create() {
    if (this.WIN_INST) return

    this.WIN_INST = new BrowserWindow(this.WIN_CONFIG)
    this.WIN_INST.removeMenu()

    if (GlobalConfig.IS_DEV_MODE) {
      this.WIN_INST.loadURL(GlobalConfig.WIN_URL)
    } else {
      this.WIN_INST.loadFile(GlobalConfig.WIN_URL)
    }

    // 启用 remote
    remote.enable(this.WIN_INST.webContents)

    // 窗口-准备好显示
    // 在窗口的控制台中使用 F5 刷新时，也会触发该事件
    this.WIN_INST.on("ready-to-show", () => {
      this.show("win=>ready-to-show", true)
      GlobalConfig.IS_DEV_MODE && this.openDevTools()
    })

    // 窗口-即将关闭
    this.WIN_INST.on("close", () => {})

    // 窗口-已关闭
    this.WIN_INST.on("closed", () => (this.WIN_INST = null))
  }

  /** 打开控制台 */
  static openDevTools() {
    if (!this.WIN_INST) return
    const winCtns = this.WIN_INST.webContents
    if (winCtns.isDevToolsOpened()) return
    winCtns.openDevTools({ mode: "undocked", title: "tools" })
  }

  /** 监听通信事件 */
  static ipcListening() {
    // 中转消息-代替中央事件总线
    ipcMain.on("vue_bus", (_, { channel, data }) => {
      if (!this.WIN_INST || !channel) return
      this.WIN_INST.webContents.send(channel, data)
    })
    // 设置窗口最小值
    ipcMain.on("set_min_size", (_, dto: WinStateDTO) => {
      if (!this.WIN_INST) return
      const size = GlobalConfig.adaptByScreen(dto, this.WIN_INST)
      const val = this.WIN_INST.isResizable()
      this.WIN_INST.setResizable(true)
      this.WIN_INST.setMinimumSize(size.width, size.height)
      this.WIN_INST.setResizable(val)
    })
    // 设置窗口大小
    ipcMain.on("set_win_size", (_, dto: WinStateDTO) => {
      if (!this.WIN_INST) return
      const size = GlobalConfig.adaptByScreen(dto, this.WIN_INST)
      this.WIN_INST.setResizable(true)
      this.WIN_INST.setSize(size.width, size.height)
      dto.center && this.WIN_INST.center()
      this.WIN_INST.setMaximizable(dto.maxable)
      this.WIN_INST.setResizable(dto.resizable)
    })
  }
}

export default WinMain
