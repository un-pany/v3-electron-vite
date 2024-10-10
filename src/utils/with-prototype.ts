import EleLog from "electron-log/renderer"
import IpcDict from "@/constants/ipc-dict"

EleLog.transports.console.format = `[{y}-{m}-{d} {h}:{i}:{s}.{ms}] => {text}`

if (process.platform === "win32") {
  Object.assign(console, EleLog.functions)
} else {
  Object.keys(EleLog.functions).forEach((fn) => {
    if (fn in console) {
      console[fn] = function (...params: any[]) {
        window.vIpcRenderer.send(IpcDict.CODE_02001, "console", ...params)
      }
    }
  })
}

window.vRemote = require("@electron/remote")
window.vIpcRenderer = require("electron")["ipcRenderer"]
window.vLog = (logName: string, ...params: any[]) => {
  window.vIpcRenderer.send(IpcDict.CODE_02001, logName, ...params)
}
