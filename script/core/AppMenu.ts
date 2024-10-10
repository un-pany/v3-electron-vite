/**
 * MacOS-顶部菜单
 */

import { Menu, MenuItem, type MenuItemConstructorOptions } from "electron"
import { LocalLogger, getLocalLogsPath } from "./AppLogger"
import { AppConfig } from "./AppConfig"
import { openFolder } from "../tool"
import WinMain from "./WinMain"

export default class AppMenu {
  // 打印日志
  private static printf(...params: any[]) {
    LocalLogger.Index.log(...params)
  }

  private static readonly MID_WINDOW = "menu.window"
  private static readonly MID_HELP = "menu.help"
  private static readonly MID_HELP_OPEN_DEVTOOLS = "menu.open.devtools"

  private static menuList: (MenuItemConstructorOptions | MenuItem)[] = [
    {
      label: AppConfig.PROJECT_NAME,
      submenu: [
        { label: `关于 ${AppConfig.getAppTitle()}` },
        { label: `版本号 v${AppConfig.APP_VERSION}` },
        { type: "separator" },
        { label: "退出", role: "quit" }
      ]
    },
    {
      id: this.MID_WINDOW,
      label: "窗口",
      submenu: [
        {
          label: "最小化",
          role: "minimize",
          click: (item) => {
            this.printf("[main.top-menu]", `<${item.label}>`, "点击")
            WinMain.instance()?.minimize()
          }
        },
        {
          label: "显示",
          click: (item) => {
            this.printf("[main.top-menu]", `<${item.label}>`, "点击")
            WinMain.show(true)
          }
        },
        {
          label: "隐藏",
          role: "hide",
          click: (item) => {
            this.printf("[main.top-menu]", `<${item.label}>`, "点击")
            WinMain.instance()?.hide()
          }
        },
        { label: "关闭", role: "close" }
      ]
    },
    {
      id: this.MID_HELP,
      label: "帮助",
      submenu: [
        {
          id: this.MID_HELP_OPEN_DEVTOOLS,
          label: "控制台",
          enabled: true,
          click: (item) => {
            this.printf("[main.top-menu]", `<帮助.${item.label}>`, "点击:打开")
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
              this.printf("[main.top-menu]", `<帮助.打开控制台>`, `位置:${item.label}`)
              WinMain.show()
              WinMain.openDevtool(k.value as any)
            }
          }))
        },
        {
          label: "本地日志",
          click: (item) => {
            const logsPath = getLocalLogsPath()
            this.printf("[main.top-menu]", `<帮助.${item.label}>`, `${logsPath}`)
            openFolder(logsPath).catch((e) => this.printf("[本地日志]", e))
          }
        }
      ]
    }
  ]

  static update() {
    const list = Menu.buildFromTemplate(this.menuList)
    Menu.setApplicationMenu(list)
  }

  static destroy() {
    this.printf("[main.top-menu]", `关闭`)
    Menu.setApplicationMenu(Menu.buildFromTemplate([]))
  }

  /** 监听相关事件 */
  static ipcListening() {
    //
  }
}
