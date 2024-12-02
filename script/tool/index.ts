import NodeOS from "os"
import IconvLite from "iconv-lite"
import { exec, type ExecOptions } from "child_process"
import { shell } from "electron"
import { AppConfig } from "../core/AppConfig"
import { LocalLogger } from "../core/AppLogger"

/** 延时器 */
export const delayer = (cd: number) => new Promise<void>((resolve) => setTimeout(resolve, cd))

/** 格式化数字 */
export const formatNumber = (num: number | string) => {
  const base = 1024
  const unitList = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB", "BB", "NB", "DB", "CB"]
  const value = Number(num)
  if (!Number.isInteger(value) || value === 0) return `0 ${unitList[0]}`
  const pow = Math.floor(Math.log(value) / Math.log(base))
  if (pow < 0) return `0 ${unitList[0]}`
  let data = (value / Math.pow(base, pow)).toFixed(2)
  if (data.endsWith(".00")) {
    data = data.substring(0, data.length - 3)
  }
  return `${data} ${unitList[pow]}`
}

/** 转义乱码 */
export const iconvDecode = (text: string | Buffer, dataDecode?: string) => {
  const value = AppConfig.IS_WIN32 ? text.toString() : IconvLite.decode(Buffer.from(text), dataDecode || "cp936")
  return value.replace(/\n$/, "").trim()
}

/** 运行 CMD 命令 */
export const runCmdOrder = (command: string, options?: ExecOptions, dataEncode?: string, dataDecode?: string) => {
  return new Promise<CmdResult>((resolve) => {
    const opt: {
      encoding: string
    } & ExecOptions = {
      encoding: dataEncode || "buffer",
      windowsHide: true,
      ...options
    }
    const startTime = Date.now()
    LocalLogger.Cmd.log("[命令]", command)
    LocalLogger.Cmd.log("[配置]", opt)
    exec(command, opt, (error, stdout, stderr) => {
      const result: CmdResult = {
        tid: Date.now().toString(),
        success: false,
        command,
        options: opt,
        spent: Date.now() - startTime,
        error: error || {},
        stderr: iconvDecode(stderr || "", dataDecode),
        stdout: iconvDecode(stdout || "", dataDecode),
        message: ""
      }
      result.message = result.stderr || error?.message || ""
      result.success = !result.message
      LocalLogger.Cmd.log(result, "\n")
      return resolve(result)
    })
  })
}

export const openFolder = (path: string) => {
  const isLinuxRoot = AppConfig.IS_LINUX && NodeOS.userInfo().uid === 0
  return isLinuxRoot ? runCmdOrder(`xdg-open "${path}"`) : shell.openPath(path)
}
