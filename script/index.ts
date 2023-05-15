import PKG from "../package.json"
import NodePath from "path"
import EleLog from "electron-log"
import { app, BrowserWindow, Tray, Menu, ipcMain, screen, BrowserWindowConstructorOptions, dialog } from "electron"
import * as remote from "@electron/remote/main"

//#region 全局配置 - 日志器
// 日志路径
// on Linux: ~/.config/{app name}/logs/{process type}.log
// on macOS: ~/Library/Logs/{app name}/{process type}.log
// on Windows: %USERPROFILE%\AppData\Roaming\{app name}\logs\{process type}.log
// 日志设置
EleLog.transports.file.format = "[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} \n{text} \n"
EleLog.transports.file.maxSize = 10 * 1024 * 1024
//#endregion

//#region 全局配置 - 进程
/** 关闭安全警告 */
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "false"
/** 必要的全局错误捕获 */
process.on("uncaughtException", (error) => {
  console.log("[uncaughtException]", error)
  EleLog.error("[uncaughtException]", error)
  exitApp("异常捕获", error.message || error.stack)
})
//#endregion

//#region 全局声明 - 变量、常量
/** 是否为开发环境 */
const isDevEnv = !app.isPackaged
/** app 目录路径
 * - dev : {project directory}/
 * - prod :
 *    1. on macOS : /Applications/{app name}.app/Contents/Resources/app/
 *    2. on Linux : {installation directory}/resources/app/
 *    3. on Windows : {installation directory}/resources/app/
 */
const appDirPath = NodePath.resolve(__dirname, "..")
/** static 目录路径
 * - dev : {project directory}/static
 * - prod :
 *    1. on macOS : /Applications/{app name}.app/Contents/Resources/app/static/
 *    2. on Linux : {installation directory}/resources/app/static/
 *    3. on Windows : {installation directory}/resources/app/static/
 */
const staticDirPath = NodePath.resolve(appDirPath, "static")
/** 根路径
 * - dev : {project directory}/
 * - prod :
 *    1. on macOS : /Applications/{app name}.app/Contents/
 *    2. on Linux : {installation directory}/
 *    3. on Windows : {installation directory}/
 */
const rootDirPath = NodePath.resolve(appDirPath, "../".repeat(isDevEnv ? 0 : 2))
/** 客户端 logo
 * https://www.electron.build/icons
 */
const logoMap = new Map([
  ["win32", "logo.ico"],
  ["darwin", "logo.icns"],
  ["linux", "logo@291x290.png"]
])
const winLogo = NodePath.join(staticDirPath, "icons", logoMap.get(process.platform) || "")
/** 加载 url 路径 */
const winURL = isDevEnv ? `http://${PKG.env.host}:${PKG.env.port}` : NodePath.join(__dirname, "./index.html")

console.log("[app   ]", appDirPath)
console.log("[root  ]", rootDirPath)
console.log("[static]", staticDirPath)
console.log("[url   ]", winURL)
console.log("")

/** 系统托盘 */
let winTray: Tray | null = null
/** 主窗口 */
let winMain: BrowserWindow | null = null
// #endregion

// #region 全局配置 - 挂载全局变量
/** 根路径 */
global.RootPath = rootDirPath
/** 静态资源路径 */
global.StaticPath = staticDirPath
/** 客户端版本号 */
global.ClientVersion = PKG.version
// #endregion

racketLanuch() // 运行

//#region 函数声明 - 应用程序
/** 程序入口 */
function racketLanuch() {
  /** 应用单例 */
  if (!app.requestSingleInstanceLock()) {
    return exitApp("There are already instances running.")
  }
  //@todo others
  // ...
  startApp()
}
/** 退出应用 */
function exitApp(title?: string, content?: string) {
  console.log("[exitApp]", title, content)
  title && content && dialog.showErrorBox(title, content)
  app.quit()
}
/** 启动应用 */
function startApp() {
  /** 初始化remote */
  remote.initialize()

  /** 忽略证书相关错误 禁用GPU */
  app.commandLine.appendSwitch("ignore-certificate-errors")
  app.commandLine.appendSwitch("no-sandbox")
  app.commandLine.appendSwitch("disable-gpu")
  app.commandLine.appendSwitch("disable-gpu-compositing")
  app.commandLine.appendSwitch("disable-gpu-rasterization")
  app.commandLine.appendSwitch("disable-gpu-sandbox")
  app.commandLine.appendSwitch("disable-software-rasterizer")

  /** 初始化完成 */
  app.whenReady().then(() => {
    monitorRenderer()
    createMainWindow()
  })

  /** 运行第二个实例时 */
  app.on("second-instance", (e, argv) => {
    showMainWindow()
    const param = "--odt="
    if (argv[1] && argv[1].indexOf(param) === 0) {
      if (argv[1].substring(param.length) === "0" && winMain) {
        winMain.maximize()
        winMain.setResizable(true)
        winMain.webContents.openDevTools()
      }
    }
  })

  /** 所有的窗口都被关闭 */
  app.on("window-all-closed", () => exitApp())

  // app.on("before-quit", (event) => {})
  // app.on("quit", (event) => {})
}
//#endregion

//#region 函数声明 - 窗口
/** 创建 主窗口 */
function createMainWindow() {
  if (winMain) return

  /** 窗口配置 */
  const options: BrowserWindowConstructorOptions = {
    icon: winLogo, // 图标
    title: PKG.env.title, // 如果由loadURL()加载的HTML文件中含有标签<title>，此属性将被忽略
    width: 1200,
    height: 800,
    minWidth: 500,
    minHeight: 400,
    show: false, // 是否在创建时显示, 默认值为 true
    frame: true, // 是否有边框
    center: true, // 是否在屏幕居中
    opacity: 0, // 设置窗口的初始透明度
    resizable: true, // 是否允许拉伸大小
    fullscreenable: true, // 是否允许全屏，为false则插件screenfull不起作用
    autoHideMenuBar: false, // 自动隐藏菜单栏, 除非按了Alt键, 默认值为 false
    backgroundColor: "#fff", // 背景颜色为十六进制值
    webPreferences: {
      devTools: true, // 是否开启 DevTools, 如果设置为 false, 则无法使用 BrowserWindow.webContents.openDevTools()。 默认值为 true
      webSecurity: false, // 当设置为 false, 将禁用同源策略
      nodeIntegration: true, // 是否启用Node集成
      contextIsolation: false, // 是否在独立 JavaScript 环境中运行 Electron API和指定的preload脚本，默认为 true
      backgroundThrottling: false, // 是否在页面成为背景时限制动画和计时器，默认值为 true
      nodeIntegrationInWorker: true // 是否在Web工作器中启用了Node集成
    }
  }
  winMain = new BrowserWindow(options)
  winMain.setMenu(null)
  isDevEnv ? winMain.loadURL(winURL) : winMain.loadFile(winURL)
  remote.enable(winMain.webContents)
  if (isDevEnv) {
    winMain.webContents.openDevTools() // 显示调试工具
  }

  /** 初始化完成后显示 */
  winMain.on("ready-to-show", () => {
    winMain?.setOpacity(1)
    showMainWindow() // 显示主窗口
    createTray() // 创建系统托盘
    winMain?.setAlwaysOnTop(true)
    winMain?.once("focus", () => winMain?.setAlwaysOnTop(false))
  })

  // /** 主窗口-即将关闭 */
  // winMain.on("close", (event) => {})

  /** 主窗口-已关闭 */
  winMain.on("closed", () => {
    destroyTray()
    winMain = null
  })
}
/** 显示 主窗口 */
function showMainWindow() {
  winMain?.center()
  winMain?.show()
  winMain?.focus()
}
/** 根据分辨率适配窗口大小 */
function adaptSizeWithScreen(params: any) {
  const devWidth = 1920 // 1920 2160
  const devHight = 1080 // 1080 1440
  const workAreaSize = screen.getPrimaryDisplay().workAreaSize // 显示器工作区域大小
  const zoomFactor = Math.max(workAreaSize.width / devWidth, workAreaSize.height / devHight)
  winMain?.webContents.send("zoom_win", zoomFactor)
  // 计算实际窗口大小
  const realSize = { width: 0, height: 0 }
  realSize.width = Math.round(params.width * zoomFactor)
  realSize.height = Math.round(params.height * zoomFactor)
  // console.log(workAreaSize, realSize, zoomFactor)
  return realSize
}
/** 监听渲染进程 */
function monitorRenderer() {
  /** 获取应用标题 */
  ipcMain.on("query_title", () => {
    winMain && winMain.webContents.send("get_title", PKG.env.title)
  })

  /** 设置窗口大小 */
  ipcMain.on("set_win_size", (_, params: any) => {
    if (!winMain) return
    const size = adaptSizeWithScreen(params)
    winMain.setResizable(true)
    winMain.setSize(size.width, size.height)
    winMain.setMaximizable(params.maxable)
    params.center && winMain.center()
    winMain.setResizable(params.resizable)
  })
}
//#endregion

//#region 函数声明 - 系统托盘
/** 销毁 */
function destroyTray() {
  winTray?.destroy()
  winTray = null
}
/** 创建 */
function createTray() {
  if (winTray) return

  /** 右键菜单选项 */
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "显示",
      click: showMainWindow
    },
    {
      label: "控制台",
      // visible: isDevEnv,
      click: () => winMain?.webContents.openDevTools()
    },
    {
      role: "quit",
      label: "关闭应用"
    }
  ])

  /** 声明托盘对象 */
  winTray = new Tray(winLogo)
  /** 悬停提示内容 */
  winTray.setToolTip(PKG.env.title)
  /** 右键菜单 */
  winTray.setContextMenu(contextMenu)
  /** 双击图标打开窗口 */
  winTray.on("double-click", showMainWindow)
}
//#endregion
