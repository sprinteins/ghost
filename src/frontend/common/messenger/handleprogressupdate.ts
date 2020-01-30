import { IpcRendererEvent } from 'electron'
import { getElectron } from '..'
import { MessageKey } from '../../../common'


export function handleProgressUpdate(handler: HandlerProgressUpdate) {
    const { ipcRenderer } = getElectron()
    ipcRenderer.on(MessageKey.EventProgressUpdate, (event: IpcRendererEvent, ...args: any[]) => {
        const progress = guardProgress(args)
        handler(progress)
    })
}

export type HandlerProgressUpdate = (progress: number) => void

function guardProgress(args: any[]): number {
    const first = args[0]
    if (typeof first !== 'number') {
        throw new Error('First arguments has to be number!')
    }

    return first
}
