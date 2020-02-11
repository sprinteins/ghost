import { MessageKey, OpenRepoMessage } from '../../../common'
import { Package } from '../../../common/messages/package'
import { sendMessage } from './sendmessage'

export function sendOpenRepoRequest(folderPath: string, query: string) {
    const req = new OpenRepoRequest(folderPath, query)
    sendMessage(req)
}

class OpenRepoRequest implements Package<OpenRepoMessage> {
    public message: OpenRepoMessage
    public channel: string

    constructor(
        folderPath: string,
        query: string,
    ) {
        this.channel = MessageKey.RequestOpenFolder
        this.message = new OpenRepoMessage(folderPath, query)
    }
}

