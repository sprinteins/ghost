import { app, BrowserWindow } from 'electron'
import * as path from 'path'
import { Backend } from './backend'
import { handleLocationChangeRequest, handleOpenFolderRequest } from './backend/common/messenger'
import { setBrowserWindow } from './backend/common/messenger/sendmessage'

import isDev from './common/is-dev'


main()

function setupBackendListeners() {
    const be = new Backend()
    handleOpenFolderRequest(be.handleOpenFolderRequest.bind(be))
    handleLocationChangeRequest(be.handleChangeLocationRequest.bind(be))

}

function main() {

    setupBackendListeners()

    let mainWindow: Electron.BrowserWindow
    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    app.on('ready', () => {
        mainWindow = createWindow()
        setBrowserWindow(mainWindow)
    })

    // Quit when all windows are closed.
    app.on('window-all-closed', () => {
        // On OS X it is common for applications and their menu bar
        // to stay active until the user quits explicitly with Cmd + Q
        if (process.platform !== 'darwin') {
            app.quit()
        }
    })

    app.on('activate', () => {
        // On OS X it"s common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (mainWindow === null) {
            createWindow()
        }
    })

    // In this file you can include the rest of your app"s specific main process
    // code. You can also put them in separate files and require them here.

}



function createWindow(): Electron.BrowserWindow {
    // Create the browser window.
    let mainWindow = new BrowserWindow({
        height: 1024,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
        width: 1024,
    })

    // and load the index.html of the app.
    // mainWindow.loadFile(path.join(__dirname, "../index.html"));
    mainWindow.loadURL(
        isDev
            ? 'http://localhost:1234'
            : `file://${path.join(__dirname, 'frontend/index.html')}`,
    )

    // Open the DevTools.
    if (isDev) {
        mainWindow.webContents.openDevTools({ mode: 'bottom' })
    }

    // Emitted when the window is closed.
    mainWindow.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })

    return mainWindow
}

