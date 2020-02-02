import { BlockType, FileBlock } from '../common'
import { sendEventFileTree, sendEventProgressUpdate } from './common/messenger'
import { File } from './file-tree/file'
import { Folder } from './file-tree/folder'
import { Inspector } from './inspector'

export class Backend {

    public async handleOpenFolderRequest(folderPath: string) {
        console.log('opening folders in backend', folderPath)
        sendEventProgressUpdate(1)


        const insp = new Inspector()
        const fileTree = await insp.analyse(folderPath)

        const root = fileTree.getRoot()
        const blocks = mapFolderChildrenToFileBlocks(root)

        console.log('blocks:', blocks)
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
