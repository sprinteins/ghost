import { MessageKey } from '../../../common'
import { Package } from '../../../common/messages/package'
import { sendMessage } from './sendmessage'

export function sendOpenRepoRequest(folderPath: string) {
    const req = new OpenRepoRequest(folderPath)
    sendMessage(req)
}

class OpenRepoRequest implements Package<string> {
    public message: string
    public channel: string

    constructor(
        folderPath: string,
    ) {
        this.channel = MessageKey.RequestOpenFolder
        this.message = folderPath
    }
}

