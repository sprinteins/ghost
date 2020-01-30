import { getElectron } from './common'


export function sendOpenRepoRequest(folderPath: string) {
    const req = new OpenRepoRequest(folderPath)
    sendMessage(req)
}

function sendMessage(pack: Package<unknown>) {
    const { ipcRenderer } = getElectron()
    ipcRenderer.send(pack.channel, pack.message)
}

class OpenRepoRequest implements Package<string> {
    public message: string
    public channel: string

    constructor(
        folderPath: string,
    ) {
        this.channel = 'request.openRepo'
        this.message = folderPath
    }
}

interface Package<T> {
    channel: string
    message: T
}
