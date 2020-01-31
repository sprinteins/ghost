import { BlockType, FileBlock } from '../common'
import { sendEventFileTree, sendEventProgressUpdate } from './common/messenger'

export class Backend {

    public handleOpenFolderRequest(folderPath: string) {
        console.log('opening folders in backend', folderPath)
        sendEventProgressUpdate(0)

        setTimeout(() => {
            const blocks = [new FileBlock('src', 15, BlockType.Folder)]
            sendEventFileTree(blocks)
        }, 1 * 1000)

    }
}
