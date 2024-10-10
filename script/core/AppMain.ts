/**
 * app
 */

import * as remote from "@electron/remote/main"
import { app, dialog, ipcMain, clipboard, type MessageBoxOptions } from "electron"
import { LogFactory, LocalLogger } from "./AppLogger"
import { AppConfig } from "./AppConfig"
import IpcDict from "../tool/ipc-dict"
import AppMenu from "./AppMenu"
import AppTray from "./AppTray"
import WinMain from "./WinMain"

export default class AppMain {
  // 打印日志
  private static printf(...params: any[]) {
    LocalLogger.Index.log(...params)
  }

  /** 是否获取应用单例锁 */
  static hasSingleLock() {
    return AppConfig.IS_DEV_MODE || app.requestSingleInstanceLock()
  }

  /** 启动应用 */
  static startApp() {
    // 初始化 remote
    remote.initialize()
    // 挂载全局变量
    AppConfig.mountGlobalVariables()

    // 初始化完成
    app.whenReady().then(() => {
      this.printf("[main.app.初始化完成]", "<ready>")
      this.ipcListening()
      if (AppConfig.IS_MACOS) {
        AppMenu.update()
        AppMenu.ipcListening()
      }
      // 托盘/程序坞
      AppTray.create()
      AppTray.ipcListening()
      // 主窗口
      WinMain.create()
      WinMain.ipcListening()
    })

    /** 应用被激活 */
    app.on("activate", () => {
      this.printf("[main.app.应用被激活]", "<activate>")
      AppConfig.IS_MACOS && WinMain.show()
    })

    /** 聚焦窗口 */
    app.on("browser-window-focus", () => {
      //
    })

    // 运行第二个实例时
    app.on("second-instance", (_, argv: string[]) => {
      this.printf("[main.app.运行第二个实例]", "<second-instance>", { argv })
      WinMain.show()
    })

    // 所有的窗口都被关闭
    app.on("window-all-closed", () => {
      this.printf("[main.app.所有的窗口都被关闭]", "<window-all-closed>")
      this.exitApp()
    })

    // 子进程意外消失
    app.on("child-process-gone", (event, detail) => {
      this.printf("[main.app.子进程意外消失]", "<child-process-gone>", event, detail)
    })

    // 渲染进程意外消失
    app.on("render-process-gone", (event, web, detail) => {
      this.printf("[main.app.渲染进程意外消失]", "<render-process-gone>", event, web.getURL(), detail)
      web.reload()
    })

    // 程序退出之前
    app.on("before-quit", () => {
      this.printf("[main.app.程序退出之前]", "<before-quit>")
    })

    // 程序退出
    app.on("quit", () => {
      this.printf("[main.app.程序已退出]", "<quit>")
      app.releaseSingleInstanceLock()
      process.exit(0)
    })
  }

  /** 退出应用 */
  static async exitApp(title?: string, content?: string, command?: string) {
    this.printf("[main.app.退出提示]", { title, content, command })
    if (title && content) {
      if (!app.isReady()) await app.whenReady()
      const opt: MessageBoxOptions = {
        type: "warning",
        icon: AppConfig.getAppLogo(),
        noLink: true,
        title: title,
        message: `${content}`,
        buttons: [command ? "确定并复制命令" : "确定"],
        cancelId: -1,
        defaultId: 0
      }
      dialog.showMessageBoxSync(opt)
      if (command) {
        clipboard.writeText(command, "selection")
        clipboard.readText("selection")
      }
    }
    app.quit()
  }

  /** 重启应用 */
  static restartApp() {
    this.printf("[main.app.重启应用]")
    !AppConfig.IS_DEV_MODE && app.relaunch()
    app.exit(0)
  }

  /** 监听相关事件 */
  static ipcListening() {
    ipcMain.on(IpcDict.CODE_01002, () => this.restartApp())
    ipcMain.on(IpcDict.CODE_02001, (_, logName: string, ...params: any[]) => {
      new LogFactory(logName).log(...params)
    })
  }
}
