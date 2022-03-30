import chalk from 'chalk'
import cfonts from 'cfonts'
import { build as viteBuild } from 'vite'

process.env.NODE_ENV = 'production'

const TAG = chalk.bgBlue(' build.mjs ')
const viteConfigs = {
    main: '.electron-vue/vite-main.config.ts',
    preload: '.electron-vue/vite-preload.config.ts',
    renderer: '.electron-vue/vite-renderer.config.ts'
}

async function buildElectron() {
    console.log() // for beautiful log.
    for (const [name, configPath] of Object.entries(viteConfigs)) {
        console.group(TAG, name)
        await viteBuild({ configFile: configPath, mode: process.env.NODE_ENV })
        console.groupEnd()
        console.log() // for beautiful log.
    }
}

cfonts.say('let’s-build', { colors: ['yellow'], font: 'simple3d' })

// bootstrap
await buildElectron()
