/**
 * 系统托盘
 */

import { app, Tray, shell, ipcMain, Menu, MenuItem, type MenuItemConstructorOptions } from "electron"
import GlobalConfig from "./GlobalConfig"
import WinMain from "./WinMain"

class WinTray {
  /** 托盘实例 */
  private static TRAY_INST: Tray | null = null

  /** 托盘菜单 */
  private static TRAY_MENU: (MenuItemConstructorOptions | MenuItem)[] = []

  /** 初始化菜单 */
  static initTrayMenu() {
    this.TRAY_MENU = [
      {
        label: "显示",
        click: () => WinMain.show("tray=>show", true)
      },
      {
        label: "隐藏",
        click: () => WinMain.getWinInst()?.hide()
      },
      {
        label: "控制台",
        click: () => {
          WinMain.show("tray=>open")
          WinMain.openDevTools()
        }
      },
      {
        label: "本地日志",
        click: () => {
          const logsPath = GlobalConfig.getLocalLogsPath()
          logsPath && shell.openPath(logsPath)
        }
      },
      {
        role: "quit",
        label: "关闭客户端"
      }
    ]
  }

  /** 托盘-创建 */
  static create() {
    const contextMenu = Menu.buildFromTemplate(this.TRAY_MENU)
    if (GlobalConfig.IS_MACOS) {
      app.dock?.setIcon(GlobalConfig.DOCKER_LOGO)
      app.dock?.setMenu(contextMenu)
      return
    }
    // 声明托盘对象
    this.TRAY_INST = new Tray(GlobalConfig.APP_LOGO)
    // 悬停提示内容
    this.TRAY_INST.setToolTip(GlobalConfig.getAppTitle())
    // 右键菜单
    this.TRAY_INST.setContextMenu(contextMenu)
    // 双击图标打开窗口
    this.TRAY_INST.on("double-click", () => WinMain.show("tray=>double-click", true))
  }

  /** 销毁托盘 */
  static destroy() {
    this.TRAY_INST?.destroy()
    this.TRAY_INST = null
    app.dock?.hide()
  }

  /** 监听相关事件 */
  static ipcListening() {
    // xxxx
    ipcMain.on(`xxxx`, () => {
      // ...
    })
  }
}

export default WinTray
