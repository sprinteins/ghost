import { sendEventProgressUpdate } from './common/messenger/progressupdate'

export class Backend {

    public handleOpenFolderRequest(folderPath: string) {
        console.log('opening folders in backend', folderPath)
        sendEventProgressUpdate(30)

    }
}
