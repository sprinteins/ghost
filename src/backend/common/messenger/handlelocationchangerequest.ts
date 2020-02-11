import { ipcMain, IpcMainEvent } from 'electron'
import { log, MessageKey } from '../../../common'


export function handleLocationChangeRequest(handler: HandlerLocationChangeRequest) {
    ipcMain.on(MessageKey.RequestChangeLocation, (event: IpcMainEvent, ...args: any[]) => {
        const folderPath = guardFolderpath(args)
        handler(folderPath)
    })
}

export type HandlerLocationChangeRequest = (folderPath: string) => void

function guardFolderpath(args: any[]): string {
    const first = args[0]
    if (typeof first !== 'string') {
        log.error('First arguments has to be string!')
        throw new Error('First arguments has to be string!')
    }

    return first
}
