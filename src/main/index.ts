import PATH from 'path'
import PKG from '../../package.json'
import LOGGER from 'electron-log'
import remote from '@electron/remote/main'
import { app, BrowserWindow, Tray, Menu, globalShortcut } from 'electron'

// 关闭安全警告
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

// 日志设置
LOGGER.transports.file.format = `[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} \n{text} \n`
LOGGER.transports.file.maxSize = 10 * 1024 * 1024

// 变量
let logo: string = ''
let tray: Tray | null = null // 托盘
let winURL: string = '' // 加载 url
let winMain: BrowserWindow | null = null // 主窗口
const loginSize = { width: 1200, height: 800 }
const preload: string = PATH.join(__dirname, '../preload/index.cjs') // 预加载脚本

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

// 启动应用
function startApp() {
    // 初始化 变量
    if (process.env.NODE_ENV !== 'development') {
        logo = PATH.join(PATH.resolve('.'), `./resources/static/icons/logo.ico`)
        winURL = PATH.join(__dirname, '../renderer/index.html')
    } else {
        logo = PATH.join(PATH.resolve('.'), `./static/icons/logo.ico`)
        winURL = `http://${PKG.env.host || '127.0.0.1'}:${PKG.env.port}`
    }

    // 初始化 remote
    remote.initialize()

    // electron 初始化完成
    app.whenReady().then(() => {
        createMainWindow()
        setShortcut()
    })

    // 当运行第二个实例时, 将会聚焦到主窗口
    app.on('second-instance', showMainWindow)

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit()
        }
    })

    // app.commandLine.appendSwitch('ignore-certificate-errors')
}

// 注册快捷键
function setShortcut() {
    // 显示调试工具
    globalShortcut.register('Alt+Ctrl+D', () => {
        if (winMain) {
            winMain.webContents.openDevTools()
            winMain.setResizable(true)
        }
    })
}

// 创建 主窗口
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
        titleBarStyle: 'default', // 标题栏样式 default | hidden | hiddenInset
        fullscreenable: false, // 是否允许全屏
        autoHideMenuBar: false, // 自动隐藏菜单栏, 除非按了Alt键, 默认值为 false
        backgroundColor: '#fff', // 背景颜色为十六进制值
        webPreferences: {
            devTools: true, // 是否开启 DevTools, 如果设置为 false, 则无法使用 BrowserWindow.webContents.openDevTools()。 默认值为 true
            preload: preload, // 预先加载指定的脚本
            contextIsolation: true, // 是否在独立 JavaScript 环境中运行 Electron API和指定的preload脚本，默认为 true
            webSecurity: false, // 当设置为 false, 将禁用同源策略
            nodeIntegration: false, // 是否启用Node集成
            backgroundThrottling: false, // 是否在页面成为背景时限制动画和计时器，默认值为 true
            nodeIntegrationInWorker: false // 是否在Web工作器中启用了Node集成
        }
    }

    winMain = new BrowserWindow(options)
    winMain.setMenu(null)
    winMain.loadURL(winURL)
    remote.enable(winMain.webContents) // 渲染进程中使用remote
    if (process.env.NODE_ENV === 'development') {
        winMain.webContents.openDevTools() // 显示调试工具
    }

    // 初始化完成后显示
    winMain.on('ready-to-show', () => {
        if (!winMain) return
        showMainWindow() // 显示主窗口
        createTray() // 系统托盘
    })

    winMain.on('closed', () => {
        winMain = null
        if (tray) {
            tray.destroy()
            tray = null
        }
    })
}

// 显示 主窗口
function showMainWindow() {
    if (!winMain) return
    winMain.show()
    winMain.focus()
    winMain.setAlwaysOnTop(true)
    winMain.setAlwaysOnTop(false)
}

// 创建 系统托盘
function createTray() {
    if (tray) return

    // 系统托盘右键菜单
    const contextMenu = Menu.buildFromTemplate([
        {
            role: 'quit',
            label: '退出'
        }
    ])

    tray = new Tray(logo)
    tray.setToolTip(PKG.env.title) // 设置此托盘图标的悬停提示内容
    tray.setContextMenu(contextMenu) // 设置此图标的右键菜单

    // 打开应用
    // tray.on('click', showMainWindow)
    tray.on('double-click', showMainWindow)
}
