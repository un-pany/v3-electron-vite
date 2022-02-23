import chalk from 'chalk'
import cfonts from 'cfonts'
import electron from 'electron'
import { join } from 'path'
import { spawn } from 'child_process'
import { readFileSync } from 'fs'
import { createServer, build as viteBuild } from 'vite'

process.env.NODE_ENV = 'development'
// process.env.VUE_APP_BASE_API = '/api/v1/'
process.env.VUE_APP_BASE_API = 'http://172.23.26.65:20002/api/v1/'

const TAG = chalk.bgCyan('\n dev-runner.mjs ')
const pkg = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf8'))

/**
 * @param {{ name: string; configFile: string; writeBundle: import('rollup').OutputPlugin['writeBundle'] }} param0
 * @returns {import('rollup').RollupWatcher}
 */
function getWatcher({ name, configFile, writeBundle }) {
    return viteBuild({
        // Ensure `vite-main.config.ts` and `vite-preload.config.ts` correct `process.env.NODE_ENV`
        mode: process.env.NODE_ENV,
        // Options here precedence over configFile
        build: {
            watch: {}
        },
        configFile,
        plugins: [{ name, writeBundle }]
    })
}

/**
 * @returns {Promise<import('rollup').RollupWatcher>}
 */
async function watchMain() {
    console.log(TAG, 'main')
    /**
     * @type {import('child_process').ChildProcessWithoutNullStreams | null}
     */
    let electronProcess = null
    /**
     * @type {import('rollup').RollupWatcher}
     */
    const watcher = await getWatcher({
        name: 'electron-main-watcher',
        configFile: '.electron-vue/vite-main.config.ts',
        writeBundle() {
            electronProcess && electronProcess.kill()
            electronProcess = spawn(electron, ['.'], {
                stdio: 'inherit',
                env: Object.assign(process.env, pkg.env)
            })
        }
    })

    return watcher
}

/**
 * @param {import('vite').ViteDevServer} viteDevServer
 * @returns {Promise<import('rollup').RollupWatcher>}
 */
async function watchPreload(viteDevServer) {
    console.log(TAG, 'preload')
    return getWatcher({
        name: 'electron-preload-watcher',
        configFile: '.electron-vue/vite-preload.config.ts',
        writeBundle() {
            viteDevServer.ws.send({
                type: 'full-reload'
            })
        }
    })
}

cfonts.say('v3-electron', { colors: ['yellow'], font: 'simple3d' })

// bootstrap
const viteDevServer = await createServer({ configFile: '.electron-vue/vite-renderer.config.ts' })
await viteDevServer.listen()
await watchPreload(viteDevServer)
await watchMain()
