import * as path from 'path'
import { CurrentLocation, FileBlock, LinkableFolder, MessageKey } from '../../../common'
import { log } from '../../../common'
import { Package } from '../../../common/messages/package'
import { Location } from '../../locator'
import { sendMessage } from './sendmessage'

export function sendEventLocationChange(loc: Location) {
    const event = new EventLocationChange(loc)
    sendMessage(event)
}

class EventLocationChange implements Package<CurrentLocation> {
    public channel: string
    public message: CurrentLocation

    constructor(
        loc: Location,
    ) {
        this.channel = MessageKey.EventLocationChange
        this.message = makeCurrentLocation(loc)
    }

}




function makeCurrentLocation(loc: Location): CurrentLocation {
    const blocks = loc.blocks
    const linkableFolders: LinkableFolder[] = loc
        .path
        .split(path.sep)
        .filter((folderName) => !!folderName)
        .reduce(reduceFolderToLinkableFolder, [])

    return {
        blocks,
        folders: linkableFolders,
        root: loc.root,
    }
}

function reduceFolderToLinkableFolder(
    folders: LinkableFolder[],
    folderName: string,
): LinkableFolder[] {

    const folderPath = path.join(lastFoldersPath(folders), folderName)

    const linkableFolder: LinkableFolder = {
        name: folderName,
        path: folderPath,
    }
    folders.push(linkableFolder)
    return folders
}

function lastFoldersPath(folders: LinkableFolder[]): string {
    const lastFolder = folders[folders.length - 1]
    if (!lastFolder) {
        return ''
    }

    return lastFolder.path
}
