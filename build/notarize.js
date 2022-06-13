const { notarize } = require('electron-notarize')

exports.default = async function notarizing(context) {
    const { electronPlatformName, appOutDir } = context
    const appInfo = context.packager.appInfo
    const appName = appInfo.productFilename
    const artifactName = `${appInfo.productName} ${appInfo.version} ${electronPlatformName} ${process.arch}.dmg`

    console.log(appOutDir, appName, artifactName)
    // Object.keys(context).forEach((key) => {
    //     console.log(key, ' : ', context[key])
    // })

    if (electronPlatformName !== 'darwin') {
        return
    }

    return await notarize({
        appBundleId: 'com.app.v3-electron-vite',
        appPath: `${appOutDir}/${appName}.app`,
        appleId: '',
        appleIdPassword: '',
        ascProvider: ''
    })
}
