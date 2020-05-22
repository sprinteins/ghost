import { ipcMain, IpcMainEvent } from 'electron'
import { guardOpenRepoCommand, log, MessageKey, OpenRepoCommand } from '../../../common'


export function handleOpenFolderRequest(handler: HandlerOpenFolderRequest) {
    ipcMain.on(MessageKey.RequestOpenFolder, (_: IpcMainEvent, ...args: any[]) => {
        const folderPath = guardOpenRepoCommand(args[0])
        handler(folderPath)
    })
}

export type HandlerOpenFolderRequest = (openRepoMsg: OpenRepoCommand) => void
