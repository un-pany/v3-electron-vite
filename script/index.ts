import NodeOS from "os"
import { app, Menu } from "electron"
import { LocalLogger } from "./core/AppLogger"
import { AppConfig } from "./core/AppConfig"
import AppMain from "./core/AppMain"

function printf(...params: any[]) {
  LocalLogger.Index.log(...params)
}

async function main() {
  if (!AppMain.hasSingleLock()) return AppMain.exitApp("Instance is running.")
  // 本地开发
  if (AppConfig.IS_DEV_MODE) {
    //
  } else {
    // 打包后
  }
  // 打印一些信息
  {
    printf("[main.index.os.arch()]", NodeOS.arch())
    printf("[main.index.os.machine()]", NodeOS.machine())
    printf("[main.index.os.homedir()]", NodeOS.homedir())
    printf("[main.index.os.userInfo()]", NodeOS.userInfo())
  }
  // 启动
  AppMain.startApp()
}

//#region 其他

function handleProcessError(error: Error) {
  LocalLogger.Exception.log("[main.index.进程异常]", error)
}

/** 关闭安全警告 */
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "false"
/** 全局错误捕获 */
process.on("uncaughtException", handleProcessError)
process.on("unhandledRejection", handleProcessError)

// 禁用 硬件加速
app.disableHardwareAcceleration()
// // 禁用 Chromium 沙盒
// app.commandLine.appendSwitch("no-sandbox")
// 忽略证书相关错误
app.commandLine.appendSwitch("ignore-certificate-errors")
// // 禁用 GPU
// app.commandLine.appendSwitch("disable-gpu")
// // 禁用 GPU 沙盒
// app.commandLine.appendSwitch("disable-gpu-sandbox")
// // 禁用 GPU 合成
// app.commandLine.appendSwitch("disable-gpu-compositing")
// // 禁用 GPU 光栅化
// app.commandLine.appendSwitch("disable-gpu-rasterization")
// // 禁用软件光栅化器
// app.commandLine.appendSwitch("disable-software-rasterizer")
// 禁用 HTTP 缓存
app.commandLine.appendSwitch("disable-http-cache")
// 禁用动画, 解决透明窗口打开闪烁问题
app.commandLine.appendSwitch("wm-window-animations-disabled")

// 禁用默认系统菜单
Menu.setApplicationMenu(Menu.buildFromTemplate([]))

// 启动
main().catch(handleProcessError)

//#endregion
