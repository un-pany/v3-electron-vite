interface Window {
  IS_DEV_ENV: Boolean
  CLIENT_VERSION: String
  vRemote: typeof import("@electron/remote")
  vIpcRenderer: typeof import("electron")["ipcRenderer"]
}
