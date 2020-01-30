import { ipcMain, IpcMainEvent } from 'electron'
import { MessageKey } from '../../../common'


export function handleOpenFolderRequest(handler: HandlerOpenFolderRequest) {
    ipcMain.on(MessageKey.RequestOpenFolder, (event: IpcMainEvent, ...args: any[]) => {
        const folderPath = guardFolderpath(args)
        handler(folderPath)
    })
}

export type HandlerOpenFolderRequest = (folderPath: string) => void

function guardFolderpath(args: any[]): string {
    const first = args[0]
    if (typeof first !== 'string') {
        throw new Error('First arguments has to be string!')
    }

    return first
}
