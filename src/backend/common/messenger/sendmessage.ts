import { BrowserWindow } from 'electron'
import { Package } from '../../../common/messages'

let browserWindow: BrowserWindow

export function sendMessage(pack: Package<unknown>) {
    browserWindow.webContents.send(pack.channel, pack.message)
}

export function setBrowserWindow(w: BrowserWindow) {
    browserWindow = w
}
