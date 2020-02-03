import { log, MessageKey } from '../../../common'
import { Package } from '../../../common/messages/package'
import { sendMessage } from './sendmessage'

export function sendEventProgressUpdate(progress: number) {
    const event = new EventProgressUpdate(progress)
    sendMessage(event)
}

class EventProgressUpdate implements Package<number> {
    public message: number
    public channel: string

    constructor(
        progress: number,
    ) {
        this.channel = MessageKey.EventProgressUpdate
        this.message = progress
    }
}

