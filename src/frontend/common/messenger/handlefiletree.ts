import { IpcRendererEvent } from 'electron'
import { getElectron } from '..'
import { FileBlock, MessageKey } from '../../../common'


export function handleFileTree(handler: HandlerFileTree) {
    const { ipcRenderer } = getElectron()
    ipcRenderer.on(MessageKey.EventFileTree, (event: IpcRendererEvent, ...args: any[]) => {
        const blocks = guardBlocks(args)
        handler(blocks)
    })
}

export type HandlerFileTree = (blocks: FileBlock[]) => void

function guardBlocks(args: any[]): FileBlock[] {
    const blocks = args[0]
    if (!Array.isArray(blocks)) {
        throw new Error('First arguments has to be an array!')
    }

    return blocks
}
