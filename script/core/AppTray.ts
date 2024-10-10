/**
 * Windows-任务栏托盘
 * MacOS-程序坞
 */

import { app, Tray, Menu, MenuItem, type MenuItemConstructorOptions } from "electron"
import { LocalLogger, getLocalLogsPath } from "./AppLogger"
import { AppConfig } from "./AppConfig"
import { openFolder } from "../tool"
import WinMain from "./WinMain"

export default class AppTray {
  // 打印日志
  private static printf(...params: any[]) {
    LocalLogger.Index.log(...params)
  }

  private static readonly MID_OPEN_DEVTOOLS = "menu.open.devtools"

  /** 托盘实例 */
  private static trayInst: Tray | null = null

  /** 托盘菜单 */
  private static menuList: (MenuItemConstructorOptions | MenuItem)[] = [
    {
      id: this.MID_OPEN_DEVTOOLS,
      label: "控制台",
      visible: true,
      click: (item) => {
        this.printf("[main.tray]", `<${item.label}>`, "点击:打开")
        WinMain.show()
        WinMain.openDevtool("undocked")
      },
      submenu: [
        { lable: "右侧", value: "right" },
        { lable: "底部", value: "bottom" },
        { lable: "分离", value: "undocked" }
      ].map((k) => ({
        label: k.lable,
        click: (item) => {
          this.printf("[main.tray]", `<打开控制台>`, `位置:${item.label}`)
          WinMain.show()
          WinMain.openDevtool(k.value as any)
        }
      }))
    },
    {
      label: "本地日志",
      click: (item) => {
        const logsPath = getLocalLogsPath()
        this.printf("[main.tray]", `<${item.label}>`, `${logsPath}`)
        openFolder(logsPath).catch((e) => this.printf("[本地日志]", e))
      }
    },
    { type: "separator" },
    {
      label: "最小化",
      click: (item) => {
        this.printf("[main.tray]", `<${item.label}>`, "点击")
        WinMain.instance()?.minimize()
      }
    },
    {
      label: "隐藏",
      click: (item) => {
        this.printf("[main.tray]", `<${item.label}>`, "点击")
        WinMain.instance()?.hide()
      }
    },
    {
      label: "显示",
      click: (item) => {
        this.printf("[main.tray]", `<${item.label}>`, "点击")
        WinMain.show(true)
      }
    },
    {
      label: `退出${AppConfig.IS_DEV_MODE ? "--dev" : ""}`,
      role: "quit"
    }
  ]

  //#region 操作菜单

  static create() {
    const contextMenu = Menu.buildFromTemplate(this.menuList)
    if (AppConfig.IS_MACOS) return app.dock?.setMenu(contextMenu)
    const icon = AppConfig.getAppLogo()
    const title = AppConfig.getAppTitle(true)
    // 声明托盘对象
    this.trayInst = new Tray(icon)
    this.trayInst.setTitle(title)
    this.trayInst.setToolTip(title)
    this.trayInst.setContextMenu(contextMenu)
    // 双击图标打开窗口
    this.trayInst.on("double-click", () => WinMain.show())
  }

  static update() {
    const contextMenu = Menu.buildFromTemplate(this.menuList)
    this.trayInst?.setContextMenu(contextMenu)
    app.dock?.setMenu(contextMenu)
  }

  /** 销毁托盘 */
  static destroy() {
    this.trayInst?.removeAllListeners()
    this.trayInst?.destroy()
    this.trayInst = null
    app.dock?.hide()
  }

  //#endregion

  /** 监听相关事件 */
  static ipcListening() {
    //
  }
}
