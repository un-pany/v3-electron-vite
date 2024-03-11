/**
 * app 模块
 */

import { app, dialog, Menu, ipcMain, type MessageBoxSyncOptions } from "electron"
import * as remote from "@electron/remote/main"
import GlobalConfig from "./GlobalConfig"
import { mainLog } from "../utils/logger"
import WinMain from "./WinMain"
import WinTray from "./WinTray"

class WinApp {
  /** 初始化 app 配置 */
  private static initAppConfig() {
    // 禁用 硬件加速
    app.disableHardwareAcceleration()
    // 禁用 Chromium 沙盒
    app.commandLine.appendSwitch("no-sandbox")
    // 忽略证书相关错误
    app.commandLine.appendSwitch("ignore-certificate-errors")
    // 禁用 GPU
    // app.commandLine.appendSwitch("disable-gpu")
    // 禁用 GPU 沙盒
    // app.commandLine.appendSwitch("disable-gpu-sandbox")
    // 禁用 GPU 合成
    // app.commandLine.appendSwitch("disable-gpu-compositing")
    // 禁用 GPU 光栅化
    // app.commandLine.appendSwitch("disable-gpu-rasterization")
    // 禁用软件光栅化器
    // app.commandLine.appendSwitch("disable-software-rasterizer")
    // 禁用 HTTP 缓存
    app.commandLine.appendSwitch("disable-http-cache")
    // 禁用动画, 解决透明窗口打开闪烁问题
    app.commandLine.appendSwitch("wm-window-animations-disabled")
  }

  /** 启动应用 */
  static startApp() {
    if (!app.requestSingleInstanceLock()) {
      return this.exitApp("There are already instances running.")
    }

    // 禁用默认系统菜单
    Menu.setApplicationMenu(null)
    // 初始化 remote
    remote.initialize()
    // 初始化 app 配置
    this.initAppConfig()
    // 挂载全局变量
    GlobalConfig.mountGlobalVariables()

    // 初始化完成
    app.whenReady().then(() => {
      this.ipcListening()
      WinMain.create()
      WinMain.ipcListening()
      WinTray.initTrayMenu()
      WinTray.create()
      WinTray.ipcListening()
    })

    // 运行第二个实例时
    app.on("second-instance", () => WinMain.show("second-instance"))

    // 所有的窗口都被关闭
    app.on("window-all-closed", () => {
      WinTray.destroy()
      this.exitApp()
    })

    // 程序退出之前
    app.on("before-quit", () => {
      mainLog.log("[before quit app] ")
    })

    // 程序退出
    app.on("quit", () => {
      mainLog.log("[app is quit] ")
      WinTray.destroy()
      app.releaseSingleInstanceLock()
    })
  }

  /** 重启应用 */
  static restartApp() {
    !GlobalConfig.IS_DEV_MODE && app.relaunch()
    app.exit(0)
  }

  /** 退出应用 */
  static exitApp(title?: string, content?: string) {
    mainLog.log("[exit-app] ", title || "", content || "")
    if (title && content) {
      const callback = () => {
        const opt: MessageBoxSyncOptions = {
          type: "warning",
          icon: GlobalConfig.APP_LOGO,
          noLink: true,
          title: title,
          message: `${content}`,
          buttons: ["确定"],
          cancelId: -1,
          defaultId: 0
        }
        dialog.showMessageBoxSync(opt)
        app.quit()
      }
      app.isReady() ? callback() : app.whenReady().then(callback)
    } else {
      app.quit()
    }
  }

  /** 监听相关事件 */
  static ipcListening() {
    // 重启
    ipcMain.on("restart_app", () => this.restartApp())
  }
}

export default WinApp
