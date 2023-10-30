/**
 * https://github.com/megahertz/electron-log
 * - [Linux] ~/.config/v3-electron-vite/logs
 * - [macOS] ~/Library/Logs/v3-electron-vite
 * - [Windows] %USERPROFILE%\AppData\Roaming\v3-electron-vite\logs
 */

import eleLog from "electron-log"

//#region 配置

/** 可选项, 调用后可在渲染进程使用 window.__electronLog */
eleLog.initialize()

/** 设置日志文件等级, 默认为 silly */
eleLog.transports.file.level = "info"

/**
 * 设置日志文件大小 1048576 (1M)
 * 达到规定大小, 备份文件并重命名为 {name}.old.log
 * 有且仅有一个备份日志文件
 */
eleLog.transports.file.maxSize = 1048576

/** 设置日志文件的数据格式 */
eleLog.transports.file.format = `[{y}-{m}-{d} {h}:{i}:{s}.{ms}] {text}`

/** 设置日志控制台等级, 默认为 silly */
eleLog.transports.console.level = "info"
eleLog.transports.console.format = `[{h}:{i}:{s}.{ms}] {text}`

//#endregion

/** 日志工厂 */
class LogFactory {
  /** 文件名称 */
  private fileName: string
  /** 日志器实例 */
  private logInst: any

  /** 构造函数 */
  constructor(name: string) {
    this.fileName = name + ".log"
    this.logInst = eleLog.create({ logId: name })
    this.logInst.transports.file.fileName = this.fileName
    this.logInst.transports.file.format = `[{y}-{m}-{d} {h}:{i}:{s}.{ms}] {text}`
    this.logInst.transports.console.level = false
    // 禁止修改
    Object.freeze(this)
  }

  /** 统一处理, 可在这里对日志进行加密 */
  private handle(type: string, ...params: any[]) {
    try {
      this.logInst[type]("\n", ...params, "\n")
    } catch (reason: any) {
      console.log("\n\n[LogFactory.handle] ", reason)
    }
  }

  //#region 日志方法
  log(...params: any[]) {
    this.handle("log", ...params)
  }
  info(...params: any[]) {
    this.handle("info", ...params)
  }
  error(...params: any[]) {
    this.handle("error", ...params)
  }
  warn(...params: any[]) {
    this.handle("warn", ...params)
  }
  verbose(...params: any[]) {
    this.handle("verbose", ...params)
  }
  debug(...params: any[]) {
    this.handle("debug", ...params)
  }
  silly(...params: any[]) {
    this.handle("silly", ...params)
  }
  //#endregion
}

export const mainLog = new LogFactory("main")
export const requestLog = new LogFactory("request")
export const exceptionLog = new LogFactory("exception")
