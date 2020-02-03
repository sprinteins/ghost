import { BlockType, FileBlock, log } from '../common'
import { sendEventFileTree, sendEventProgressUpdate } from './common/messenger'
import { File } from './file-tree/file'
import { Folder } from './file-tree/folder'
import { Inspector } from './inspector'

export class Backend {

    public async handleOpenFolderRequest(folderPath: string) {
        sendEventProgressUpdate(1)


        const insp = new Inspector()
        const fileTree = await insp.analyse(folderPath)

        const root = fileTree.getRoot()
        const blocks = mapFolderChildrenToFileBlocks(root)

        sendEventFileTree(blocks)
        sendEventProgressUpdate(100)

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
