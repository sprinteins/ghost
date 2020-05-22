import { BlockType, FileBlock, log, OpenRepoCommand } from '../common'
import { sendEventProgressUpdate } from './common/messenger'
import { sendEventLocationChange } from './common/messenger/currentlocation'
import { FileTree } from './file-tree'
import { File } from './file-tree/file'
import { Folder } from './file-tree/folder'
import { Inspector } from './inspector'
import { Locator } from './locator'

export class Backend {

    private locator: Locator

    constructor() {
        // this.locator = new Locator(new FileTree(), '')
    }


    public async handleOpenFolderRequest(orc: OpenRepoCommand) {
        sendEventProgressUpdate(1)
        const insp = new Inspector()
        const fileTree = await insp.analyse(orc.folderPath, undefined, orc.query)
        this.locator = new Locator(fileTree, orc.folderPath, orc.viewType)
        sendEventProgressUpdate(100)
        sendEventLocationChange(this.locator.getCurrentLocation())

    }

    // TODO:
    // choose one: location / folder / directory
    public async handleChangeLocationRequest(folderPath: string) {
        this.locator.changeDirector(folderPath)
        sendEventLocationChange(this.locator.getCurrentLocation())
    }
}


function mapFolderChildrenToFileBlocks(folder: Folder): FileBlock[] {

    const folderBlocks: FileBlock[] = folder.getFolders().map(mapFolderToBlock)
    const fileBlocks: FileBlock[] = folder.getFiles().map(mapFileToBlock)

    return [].concat(folderBlocks, fileBlocks)

}


function mapFolderToBlock(folder: Folder): FileBlock {
    return new FileBlock(folder.name, folder.getOccurrences(), BlockType.Folder)
}

function mapFileToBlock(file: File): FileBlock {
    return new FileBlock(file.getName(), file.getOccurrences(), BlockType.Folder)
}
