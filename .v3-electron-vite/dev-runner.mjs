import chalk from "chalk"
import cfonts from "cfonts"
import electron from "electron"
import { spawn } from "child_process"
import { createServer, build } from "vite"

process.env.NODE_ENV = "development"

const TAG = chalk.bgCyan("\n dev-runner.mjs ")

/**
 *
 */
function watchMain() {
  console.log(TAG, "main")
  let electronProcess = null
  const startElectron = {
    name: "electron-main-watcher",
    writeBundle() {
      electronProcess && electronProcess.kill()
      electronProcess = spawn(electron, ["."], { stdio: "inherit", env: process.env })
    }
  }
  return build({
    mode: process.env.NODE_ENV,
    configFile: ".v3-electron-vite/vite-main.config.ts",
    plugins: [startElectron],
    build: { watch: {} }
  })
}

/**
 *
 */
function watchPreload(server) {
  console.log(TAG, "preload")
  return build({
    mode: process.env.NODE_ENV,
    configFile: ".v3-electron-vite/vite-preload.config.ts",
    plugins: [
      {
        name: "electron-preload-watcher",
        writeBundle() {
          server.ws.send({ type: "full-reload" })
        }
      }
    ],
    build: { watch: {} }
  })
}

cfonts.say("v3-electron-vite", { colors: ["yellow"], font: "simple3d" })

// bootstrap
const server = await createServer({ configFile: ".v3-electron-vite/vite-renderer.config.ts" })

await server.listen()
await watchPreload(server)
await watchMain()
