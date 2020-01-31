import { FileBlock, MessageKey } from '../../../common'
import { Package } from '../../../common/messages/package'
import { sendMessage } from './sendmessage'

export function sendEventFileTree(blocks: FileBlock[]) {
    const event = new EventFileTree(blocks)
    console.log('sending file tree:', event)
    sendMessage(event)
}

class EventFileTree implements Package<FileBlock[]> {
    public message: FileBlock[]
    public channel: string

    constructor(
        blocks: FileBlock[],
    ) {
        this.channel = MessageKey.EventFileTree
        this.message = blocks
    }
}
