import { ipcMain, IpcMainEvent } from 'electron'
import { log, MessageKey, OpenRepoMessage } from '../../../common'


export function handleOpenFolderRequest(handler: HandlerOpenFolderRequest) {
    ipcMain.on(MessageKey.RequestOpenFolder, (event: IpcMainEvent, ...args: any[]) => {
        const folderPath = guardOpenRepoMessage(args)
        handler(folderPath)
    })
}

export type HandlerOpenFolderRequest = (openRepoMsg: OpenRepoMessage) => void

function guardOpenRepoMessage(args: any[]): OpenRepoMessage {
    const openRepoMsg = args[0] as OpenRepoMessage
    if (!openRepoMsg || openRepoMsg.folderPath === undefined || openRepoMsg.query === undefined) {
        const errorMsg = `wrong format for "OpenRepoMessage": ${openRepoMsg}`
        log.error(errorMsg)
        throw new Error(errorMsg)
    }

    return openRepoMsg
}
