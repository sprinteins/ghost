import { IpcRendererEvent } from 'electron'
import { getElectron } from '..'
import { CurrentLocation, MessageKey } from '../../../common'


export function handleLocationChange(handler: HandlerLocationChange) {
    const { ipcRenderer } = getElectron()
    ipcRenderer.on(MessageKey.EventLocationChange, (event: IpcRendererEvent, ...args: any[]) => {
        const location = guardLocation(args)
        handler(location)
    })
}

export type HandlerLocationChange = (loc: CurrentLocation) => void

function guardLocation(args: any[]): CurrentLocation {
    const loc = args[0]
    if (!loc) {
        throw new Error('No "CurrentLocation found"')
    }

    if (!Array.isArray(loc.folders) || !Array.isArray(loc.blocks)) {
        throw new Error('Wrong Format: No Folders of Block found')
    }

    return loc

}
