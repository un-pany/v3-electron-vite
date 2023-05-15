const remote = require("@electron/remote")
const { ipcRenderer } = require("electron")
window.IS_DEV_ENV = process.env.NODE_ENV !== "production"
window.CLIENT_VERSION = remote.getGlobal("ClientVersion")
window.vRemote = remote
window.vIpcRenderer = ipcRenderer
