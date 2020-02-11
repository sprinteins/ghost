import { MessageKey } from '../../../common'
import { Package } from '../../../common/messages/package'
import { sendMessage } from './sendmessage'

export function sendChangeLocationRequest(folderPath: string) {
    const req = new LocationChangeRequest(folderPath)
    sendMessage(req)
}

class LocationChangeRequest implements Package<string> {
    public message: string
    public channel: string

    constructor(
        folderPath: string,
    ) {
        this.channel = MessageKey.RequestChangeLocation
        this.message = folderPath
    }
}

