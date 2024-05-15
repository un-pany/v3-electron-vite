/**
 * 全局配置
 */

import NodePath from "path"
import { app, screen, BrowserWindow } from "electron"
import PKG from "../../package.json"

class GlobalConfig {
  //#region 只读属性

  /** 是否为 Windows 平台 */
  static readonly IS_WIN32 = process.platform === "win32"
  /** 是否为 macOS 平台 */
  static readonly IS_MACOS = process.platform === "darwin"
  /** 是否为 Linux 平台 */
  static readonly IS_LINUX = process.platform === "linux"
  /** 是否为开发模式 */
  static readonly IS_DEV_MODE = !app.isPackaged
  /** 项目名称 */
  static readonly PROJECT_NAME = PKG.name
  /**
   * 源码目录
   * - dev : {project directory}/
   * - prod :
   *    1. on macOS : /Applications/{app name}.app/Contents/Resources/app?.asar
   *    2. on Linux : {installation directory}/resources/app?.asar
   *    3. on Windows : {installation directory}/resources/app?.asar
   */
  static readonly DIR_APP = app.getAppPath()
  /** 静态资源目录 */
  static readonly DIR_STATIC = NodePath.resolve(this.DIR_APP, "static")
  /** 存放资源文件的目录 */
  static readonly DIR_RESOURCES = NodePath.resolve(this.DIR_APP, this.IS_DEV_MODE ? "" : "..")
  /** 根目录/安装目录 */
  static readonly DIR_ROOT = this.IS_DEV_MODE ? this.DIR_APP : NodePath.resolve(this.DIR_RESOURCES, "..")
  /** 版本号 */
  static readonly APP_VERSION = PKG.version

  //#endregion

  /** 程序名称 */
  static getAppTitle() {
    const suffix = this.IS_DEV_MODE ? ` | v${this.APP_VERSION}` : ""
    return `${import.meta.env.VITE_APP_TITLE || this.PROJECT_NAME}${suffix}`
  }

  /** 程序图标 */
  static getAppLogo(isDocker?: boolean) {
    const logoList = {
      win32: "icons/logo_256x256.ico",
      darwin: "icons/logo_256x256.icns",
      linux: "icons/logo_256x256.png"
    }
    const type = isDocker ? "linux" : process.platform
    return NodePath.join(this.DIR_STATIC, logoList[type])
  }

  /** 运行地址/路径 */
  static getWinUrl() {
    if (this.IS_DEV_MODE) return `http://${PKG.env.host}:${PKG.env.port}`
    return NodePath.join(this.DIR_APP, "dist/index.html")
  }

  /** 本地日志路径 */
  static getLocalLogsPath() {
    return app.getPath("logs")
  }

  /** 挂载全局变量 */
  static mountGlobalVariables() {
    // 静态资源路径
    global.StaticPath = this.DIR_STATIC
    // 客户端图标
    global.ClientLogo = this.getAppLogo()
    // 客户端版本号
    global.ClientVersion = this.APP_VERSION
  }

  /** 根据分辨率适配窗口大小 */
  static adaptByScreen(dto: WinStateDTO, win: BrowserWindow | null) {
    const devSize = { width: 1920, height: 1080 }
    const areaSize = screen.getPrimaryDisplay().workAreaSize
    const zoomFactor = Math.min(1, areaSize.width / devSize.width, areaSize.height / devSize.height)
    const realSize = { width: 0, height: 0 }
    realSize.width = Math.round(dto.width * zoomFactor)
    realSize.height = Math.round(dto.height * zoomFactor)
    win?.webContents.setZoomFactor(zoomFactor)
    return realSize
  }
}

export default GlobalConfig
