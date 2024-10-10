/**
 * 全局配置
 */

import NodePath from "path"
import { app, screen, BrowserWindow } from "electron"
import PKG from "../../package.json"

export class AppConfig {
  //#region 只读属性-应用信息

  /** 是否为 Windows 平台 */
  static readonly IS_WIN32 = process.platform === "win32"
  /** 是否为 MacOS 平台 */
  static readonly IS_MACOS = process.platform === "darwin"
  /** 是否为 Linux 平台 */
  static readonly IS_LINUX = process.platform === "linux"
  /** 是否为 x64 客户端 */
  static readonly IS_X64_ARCH = process.arch === "x64"
  /** 是否为开发模式 */
  static readonly IS_DEV_MODE = !app.isPackaged
  /** 项目名称 */
  static readonly PROJECT_NAME = PKG.name // same as build.productName
  /** 版本号 */
  static readonly APP_VERSION = PKG.version

  //#endregion

  //#region 只读属性-路径

  /**
   * 应用程序目录
   * - dev : {project directory}/
   * - prod :
   *    1. on macOS   : {?}/{app name}.app/Contents/Resources/app?.asar
   *    2. on Linux   : {?}/{app name}/resources/app?.asar
   *    3. on Windows : {?}/{app name}/resources/app?.asar
   */
  static readonly DIR_APP = app.getAppPath()

  /**
   * 静态资源目录
   * - dev : {project directory}/static
   * - prod :
   *    1. on macOS   : {?}/{app name}.app/Contents/Resources/app?.asar/static
   *    2. on Linux   : {?}/{app name}/resources/app?.asar/static
   *    3. on Windows : {?}/{app name}/resources/app?.asar/static
   */
  static readonly DIR_STATIC = NodePath.resolve(this.DIR_APP, "static")

  /**
   * Resources 目录
   * - dev : {project directory}/
   * - prod :
   *    1. on macOS   : {?}/{app name}.app/Contents/Resources
   *    2. on Linux   : {?}/{app name}/resources
   *    3. on Windows : {?}/{app name}/resources
   */
  static readonly DIR_RESOURCES = NodePath.resolve(this.DIR_APP, this.IS_DEV_MODE ? "" : "..")

  /**
   * 根目录/安装目录
   * - dev : {project directory}/
   * - prod :
   *    1. on macOS   : {?}/{app name}.app/Contents
   *    2. on Linux   : {?}/{app name}/
   *    3. on Windows : {?}/{app name}/
   */
  static readonly DIR_ROOT = this.IS_DEV_MODE ? this.DIR_APP : NodePath.resolve(this.DIR_RESOURCES, "..")

  /** 可执行文件路径 */
  static readonly PATH_EXEC = NodePath.resolve(this.DIR_ROOT, this.IS_MACOS ? "MacOS" : "", this.PROJECT_NAME)

  //#endregion

  /** 程序名称 */
  static getAppTitle(withVersion?: boolean) {
    const suffix = this.IS_DEV_MODE || withVersion ? ` | v${this.APP_VERSION}` : ""
    return `${import.meta.env.VITE_APP_TITLE || this.PROJECT_NAME}${suffix}`
  }

  /** 程序图标 */
  static getAppLogo(usePng?: boolean) {
    const size = 256
    const logoList = {
      win32: `icons/logo_${size}x${size}.ico`,
      darwin: `icons/logo_${size}x${size}.icns`,
      linux: `icons/logo_${size}x${size}.png`
    }
    const type = usePng ? "linux" : process.platform
    return NodePath.join(this.DIR_STATIC, logoList[type])
  }

  /** 运行地址/路径 */
  static getWinUrl() {
    if (this.IS_DEV_MODE) return `http://${PKG.env.host}:${PKG.env.port}`
    return NodePath.join(this.DIR_APP, "dist/index.html")
  }

  /** 挂载全局变量 */
  static mountGlobalVariables() {
    // 路径-静态资源
    global.StaticPath = this.DIR_STATIC
    // 图标
    global.ClientLogo = this.getAppLogo()
    // 版本号
    global.ClientVersion = this.APP_VERSION
  }

  /** 根据分辨率适配窗口大小 */
  static adaptByScreen(dto: WinStateDTO, win: BrowserWindow | null) {
    const devSize = { width: 1920, height: 1080 }
    // const devSize = { width: 3440, height: 1440 }
    const areaSize = screen.getPrimaryDisplay().workAreaSize
    // const areaSize = { width: 3440, height: 1440 }
    // const areaSize = { width: 2160, height: 1440 }
    // const areaSize = { width: 1920, height: 1440 }
    // const areaSize = { width: 1600, height: 1200 }
    // const areaSize = { width: 1440, height: 900 }
    // const areaSize = { width: 1280, height: 768 }
    // const areaSize = { width: 1024, height: 768 }
    // const areaSize = { width: 800, height: 600 }
    const zoomFactor = Math.min(1, areaSize.width / devSize.width, areaSize.height / devSize.height)
    const realSize = { width: 0, height: 0 }
    realSize.width = Math.floor(dto.width * zoomFactor)
    realSize.height = Math.floor(dto.height * zoomFactor)
    win?.webContents.setZoomFactor(zoomFactor)
    // console.log(zoomFactor, realSize)
    return realSize
  }
}
