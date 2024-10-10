/**
 * 主窗口
 */

import * as remote from "@electron/remote/main"
import { ipcMain, BrowserWindow, type BrowserWindowConstructorOptions } from "electron"
import { LocalLogger } from "./AppLogger"
import { AppConfig } from "./AppConfig"
import IpcDict from "../tool/ipc-dict"

export default class WinMain {
  // 打印日志
  private static printf(...params: any[]) {
    LocalLogger.Index.log(...params)
  }

  /** 窗口实例 */
  private static winInst: BrowserWindow | null = null

  /** 窗口配置 */
  private static winOption: BrowserWindowConstructorOptions = {
    icon: AppConfig.getAppLogo(), // 图标
    title: AppConfig.getAppTitle(), // 如果由 loadURL() 加载的 HTML 文件中含有标签 <title>，此属性将被忽略
    minWidth: 1024,
    minHeight: 768,
    show: false, // 是否在创建时显示, 默认值为 true
    frame: true, // 是否有边框
    center: true, // 是否在屏幕居中
    hasShadow: false, // 窗口是否有阴影. 默认值为 true
    resizable: true, // 是否允许拉伸大小
    fullscreenable: true, // 是否允许全屏
    autoHideMenuBar: true, // 自动隐藏菜单栏, 除非按了 Alt 键, 默认值为 false
    backgroundColor: "transparent", // 背景颜色
    webPreferences: {
      devTools: true, // 是否开启 DevTools, 如果设置为 false（默认值为 true）, 则无法使用 BrowserWindow.webContents.openDevTools()
      webSecurity: false, // 当设置为 false, 将禁用同源策略
      nodeIntegration: true, // 是否启用 Node 集成
      contextIsolation: false, // 是否在独立 JavaScript 环境中运行 Electron API 和指定的 preload 脚本，默认为 true
      nodeIntegrationInWorker: true, // 是否在 Web 工作器中启用了 Node 集成
      backgroundThrottling: false, // 是否在页面成为背景时限制动画和计时器，默认值为 true
      spellcheck: false // 是否启用内置拼写检查器
    }
  }

  /** 获取窗口实例 */
  static instance() {
    return this.winInst
  }

  static sendToRenderer(channel: string, ...params: any[]) {
    this.printf("[main.win.主进程>>>渲染进程]", `<频道>`, channel)
    this.printf("[main.win.主进程>>>渲染进程]", `<参数>`, ...params)
    this.winInst?.webContents.send(channel, ...params)
  }

  /** 显示窗口 */
  static show(center?: boolean) {
    this.printf("[main.win.显示主窗口]", { center })
    this.winInst?.show()
    this.winInst?.focus()
    center && this.winInst?.center()
  }

  /** 创建窗口 */
  static create() {
    if (this.winInst) return

    this.winInst = new BrowserWindow(this.winOption)
    this.winInst.removeMenu()
    if (AppConfig.IS_DEV_MODE) {
      this.winInst.loadURL(AppConfig.getWinUrl())
    } else {
      this.winInst.loadFile(AppConfig.getWinUrl())
    }

    // 启用 remote
    remote.enable(this.winInst.webContents)
    // AppConfig.IS_DEV_MODE && this.openDevtool()

    // 窗口-准备好显示
    // 在窗口的控制台中使用 F5 刷新时，也会触发该事件
    this.winInst.on("ready-to-show", () => {
      this.printf("[main.win.即将显示]", "<ready-to-show>")
      this.show(true)
      this.winInst?.center()
    })

    // 窗口-即将关闭
    this.winInst.on("close", () => {
      this.printf("[main.win.即将关闭]", "<close>")
    })

    // 窗口-已关闭
    this.winInst.on("closed", () => {
      this.printf("[main.win.已关闭]", "<closed>")
      this.winInst?.removeAllListeners()
      this.winInst = null
    })
  }

  /** 打开控制台 */
  static openDevtool(type?: "right" | "bottom" | "undocked") {
    if (!this.winInst) return
    const winCtns = this.winInst.webContents
    winCtns.closeDevTools()
    winCtns.openDevTools({ mode: type || "undocked", title: " " })
  }

  /** 监听通信事件 */
  static ipcListening() {
    // 设置窗口默认尺寸
    ipcMain.on(IpcDict.CODE_01001, (_, dto: WinStateDTO) => {
      if (!this.winInst) return
      const size = AppConfig.adaptByScreen(dto, this.winInst)
      this.winInst.setResizable(true)
      this.winInst.setMinimumSize(size.width, size.height)
      this.winInst.setSize(size.width, size.height)
      dto.center && this.winInst.center()
      typeof dto.maxable === "boolean" && this.winInst.setMaximizable(dto.maxable)
      typeof dto.resizable === "boolean" && this.winInst.setResizable(dto.resizable)
    })
    // 中转消息-代替中央事件总线
    ipcMain.on(IpcDict.CODE_02002, (_, args: any) => {
      if (!this.winInst || !args || !args.channel) return
      this.printf("[main.win.事件总线]", args)
      this.sendToRenderer(args.channel, args.data)
    })
  }
}
