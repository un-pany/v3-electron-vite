/**
 * 本地日志
 * https://github.com/megahertz/electron-log
 * - 默认路径
 * - [Linux] ~/.config/{app name}/logs/main.log
 * - [macOS] ~/Library/Logs/{app name}/main.log
 * - [Windows] %USERPROFILE%\AppData\Roaming\{app name}\logs\main.log
 */

import NodePath from "path"
import DayJS from "dayjs"
import EleLog from "electron-log"
import { AppConfig } from "./AppConfig"

function getLogId(name: string) {
  const tid = DayJS(new Date()).format("YYYYMMDD")
  return `[${AppConfig.PROJECT_NAME}]-${AppConfig.IS_DEV_MODE ? "dev" : tid}-${name}`
}

function setTagToLog(logger: EleLog.MainLogger) {
  if (AppConfig.IS_DEV_MODE) {
    logger.transports.file.getFile().clear()
  } else {
    logger.log("\n".repeat(4), `⚡`.repeat(99), "\n".repeat(3))
  }
}

EleLog.initialize()
EleLog.transports.file.fileName = `${getLogId("console")}.log`
setTagToLog(EleLog)

export function getLocalLogsPath() {
  return NodePath.dirname(EleLog.transports.file.getFile().path)
}

/** 日志工厂 */
export class LogFactory {
  //
  static readonly nameSet = new Set<string>()

  /** 文件名称 */
  private fileName: string
  /** 日志器实例 */
  private logInst: EleLog.MainLogger

  /** 构造函数 */
  constructor(name: string) {
    const logId = getLogId(name)
    this.fileName = `${logId}.log`
    this.logInst = EleLog.create({ logId })
    this.logInst.transports.file.fileName = this.fileName
    this.logInst.transports.file.maxSize = 1048576
    this.logInst.transports.file.format = `[{y}-{m}-{d} {h}:{i}:{s}.{ms}] >> {text}`
    this.logInst.transports.ipc.level = ["index", "cmd"].includes(name) ? false : "info"
    this.logInst.transports.console.level = false
  }

  /** 统一处理, 可在这里对日志进行加密 */
  private handle(type: string, ...params: any[]) {
    try {
      if (!LogFactory.nameSet.has(this.fileName)) {
        LogFactory.nameSet.add(this.fileName)
        setTagToLog(this.logInst)
      }
      this.logInst[type](...params)
    } catch (reason: any) {
      console.log("[LogFactory.handle] ", reason)
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

  getFilePath() {
    return this.logInst.transports.file.getFile().path
  }
}

export class LocalLogger {
  static readonly Exception = new LogFactory("exception")
  static readonly Index = new LogFactory("index")
  static readonly Cmd = new LogFactory("cmd")
  static readonly Net = new LogFactory("net")
}
