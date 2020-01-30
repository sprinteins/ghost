import { Package } from '../../../common/messages/package'
import { getElectron } from '../electron'

export function sendMessage(pack: Package<unknown>) {
    const { ipcRenderer } = getElectron()
    ipcRenderer.send(pack.channel, pack.message)
}

