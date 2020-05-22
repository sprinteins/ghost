import { MessageKey, OpenRepoCommand, ViewType } from '../../../common'
import { Package } from '../../../common/messages/package'
import { } from '../../components'
import { sendMessage } from './sendmessage'


export function sendOpenRepoRequest(
    folderPath: string,
    query: string,
    viewType: ViewType,
) {
    const req = new OpenRepoRequest(folderPath, query, viewType)
    sendMessage(req)
}

class OpenRepoRequest implements Package<OpenRepoCommand> {
    public message: OpenRepoCommand
    public channel: string

    constructor(
        folderPath: string,
        query: string,
        viewType: ViewType,
    ) {
        this.channel = MessageKey.RequestOpenFolder
        this.message = new OpenRepoCommand(folderPath, query, viewType)
    }
}

