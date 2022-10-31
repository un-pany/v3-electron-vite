import PATH from "path"
import PKG from "../../package.json"
import LOGGER from "electron-log"
import { app, BrowserWindow, Tray, Menu, globalShortcut, ipcMain } from "electron"
const remote = require("@electron/remote/main")
remote.initialize() // 初始化

// 必要的全局错误捕获
process.on("uncaughtException", (error) => {
  LOGGER.error("uncaughtException: ", error.stack || JSON.stringify(error))
  app.exit()
})

// 关闭安全警告
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true"

// 日志路径
// on Linux: ~/.config/{app name}/logs/{process type}.log
// on macOS: ~/Library/Logs/{app name}/{process type}.log
// on Windows: %USERPROFILE%\AppData\Roaming\{app name}\logs\{process type}.log
// 日志设置
LOGGER.transports.file.format = "[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} \n{text} \n"
LOGGER.transports.file.maxSize = 10 * 1024 * 1024

const isDev = !app.isPackaged

// 变量
let logo = ""
let tray: Tray | null = null // 托盘
let winURL = "" // 加载 url
let winMain: BrowserWindow | null = null // 主窗口
const loginSize = { width: 1200, height: 800 }
const preload: string = PATH.join(__dirname, "../preload/index.js") // 预加载脚本

// 全局变量
global.version = PKG.version

// 应用 单例
if (app.requestSingleInstanceLock()) {
  // 启动应用
  startApp()
} else {
  // 如果获取失败，说明已经有实例在运行了，直接退出
  app.quit()
}

/*----------------------------------------------------------------------------------------------------------------------------------------------------------
 ------------------------------------------------------------------ functions-------------------------------------------------------------------------------
 ------------------------------------------------------------------ ----------------------------------------------------------------------------------------
*/

//#region
/** 启动应用 */
function startApp() {
  // 初始化 变量
  const ext = process.platform === "darwin" ? "icns" : "ico"
  if (isDev) {
    logo = PATH.join(PATH.resolve("."), `./static/icons/logo.${ext}`)
    winURL = `http://${PKG.env.host || "127.0.0.1"}:${PKG.env.port}`
  } else {
    if (process.platform === "darwin") {
      logo = PATH.join(__dirname, `../../static/icons/logo.${ext}`)
    } else {
      logo = PATH.join(PATH.resolve("."), `./resources/app/static/icons/logo.${ext}`)
    }
    winURL = PATH.join(__dirname, "../index.html")
  }

  // electron 初始化完成
  app.whenReady().then(() => {
    monitorRenderer()
    createMainWindow()
    setShortcut()
  })

  // 当运行第二个实例时, 将会聚焦到主窗口
  app.on("second-instance", showMainWindow)

  app.on("window-all-closed", () => app.quit())

  // app.commandLine.appendSwitch('ignore-certificate-errors')
}
/** 注册快捷键 */
function setShortcut() {
  // 显示调试工具
  globalShortcut.register("CommandOrControl+D", () => {
    if (winMain) {
      winMain.webContents.closeDevTools()
      winMain.webContents.openDevTools()
      winMain.setResizable(true)
    }
  })
}
/** 监听渲染进程 */
function monitorRenderer() {
  /** 获取应用标题 */
  ipcMain.on("query_title", () => {
    winMain && winMain.webContents.send("get_title", PKG.env.title)
  })
}
//#endregion

//#region 主窗口+托盘
/** 创建 主窗口 */
function createMainWindow() {
  if (winMain) return
  // 配置
  const options: Object = {
    icon: logo, // 图标
    title: PKG.env.title, // 标题，默认为"Electron"。如果由loadURL()加载的HTML文件中含有标签<title>，此属性将被忽略
    width: loginSize.width, // 宽度
    height: loginSize.height, // 高度
    minWidth: loginSize.width,
    minHeight: loginSize.height,
    show: false, // 是否在创建时显示, 默认值为 true
    frame: true, // 是否有边框
    center: true, // 是否在屏幕居中
    resizable: true, // 是否允许拉伸大小
    fullscreenable: true, // 是否允许全屏，为false则插件screenfull不起作用
    autoHideMenuBar: false, // 自动隐藏菜单栏, 除非按了Alt键, 默认值为 false
    backgroundColor: "#fff", // 背景颜色为十六进制值
    webPreferences: {
      devTools: true, // 是否开启 DevTools, 如果设置为 false, 则无法使用 BrowserWindow.webContents.openDevTools()。 默认值为 true
      preload: preload, // 预先加载指定的脚本
      webSecurity: false, // 当设置为 false, 将禁用同源策略
      nodeIntegration: true, // 是否启用Node集成
      contextIsolation: true, // 是否在独立 JavaScript 环境中运行 Electron API和指定的preload脚本，默认为 true
      backgroundThrottling: false, // 是否在页面成为背景时限制动画和计时器，默认值为 true
      nodeIntegrationInWorker: true // 是否在Web工作器中启用了Node集成
    }
  }
  winMain = new BrowserWindow(options)
  winMain.setMenu(null)
  isDev ? winMain.loadURL(winURL) : winMain.loadFile(winURL)
  remote.enable(winMain.webContents)
  // if (isDev) {
  winMain.webContents.openDevTools() // 显示调试工具
  // }

  // 初始化完成后显示
  winMain.on("ready-to-show", () => {
    showMainWindow() // 显示主窗口
    createTray() // 系统托盘
  })
  winMain.on("closed", () => {
    tray?.destroy()
    tray = null
    winMain = null
  })
}
/** 显示 主窗口 */
function showMainWindow() {
  if (!winMain) return
  winMain.show()
  winMain.focus()
  // winMain.setAlwaysOnTop(true)
  // winMain.setAlwaysOnTop(false)
}
/** 创建 系统托盘 */
function createTray() {
  if (tray) return

  // 系统托盘右键菜单
  const contextMenu = Menu.buildFromTemplate([
    {
      role: "quit",
      label: "退出"
    }
  ])

  // tray = new Tray(nativeImage.createFromPath(logo))
  tray = new Tray(logo)
  tray.setToolTip(PKG.env.title) // 设置此托盘图标的悬停提示内容
  tray.setContextMenu(contextMenu) // 设置此图标的右键菜单
  // 打开应用
  // tray.on('click', showMainWindow)
  tray.on("double-click", showMainWindow)
}
//#endregion
