/** 设置窗口状态 */
interface WinStateDTO {
  width: number
  height: number
  center: boolean
  maxable: boolean
  resizable: boolean
}

/** 执行 cmd 命令的结果 */
interface CmdResult {
  tid: string
  success: boolean
  command: string
  options?: any
  spent: number
  error: any
  stderr: string
  stdout: string
  message: string
}

interface Window {
  /** electron.remote */
  vRemote: typeof import("@electron/remote")
  /** electron.ipcRenderer */
  vIpcRenderer: (typeof import("electron"))["ipcRenderer"]
  /** 本地日志 */
  vLog: (logName: LogType, ...params: any[]) => void
}
