import * as path from 'path'
import { inspect } from 'util'
import { log } from '../../common'
import { File } from './file/file'
import { Folder } from './folder'

export class FileTree {


    private files: FilesByPath = {}
    private folders: FoldersByPath = {}
    private root: Folder

    constructor() {
        this.root = new Folder('')
        this.folders[''] = this.root
    }

    /**
     * return the root folder
     */
    public getRoot(): Folder {
        return this.root
    }

    /**
     * addFile increases the occurrence number of given path of a file
     * @param filePath the path of the file
     */
    public addFile(filePath: string, line?: string) {
        try {

            this.addFileWithOccurrence(filePath)
        } catch (err) {
            log.error(err, line)
        }
    }

    /**
     * Moves a file from from an old path to a new one
     * and merges the number of occurrences
     * @param oldFilePath the old path of the file
     * @param newFilePath the new path of the file
     */
    public move(oldFilePath: string, newFilePath: string, line?: string) {
        let oldFile = this.findFileByPath(oldFilePath)

        if (!oldFile) {
            this.addFile(oldFilePath, line)
            oldFile = this.getFileByPath(oldFilePath)
        }

        try {
            const oldFolder = this.getFolderByPath(oldFile.getParentFolderPath())

            this.addFileWithOccurrence(newFilePath, oldFile.getOccurrences())

            oldFolder.removeFileByName(oldFile.getName())
            this.removeFileByPath(oldFilePath)

        } catch (e) {
            log.error('line:', line)
            throw e
        }


    }

    public findFolderByPath(folderPath: string): Folder | undefined {
        return this.folders[folderPath]
    }

    /**
     * Returns the gather occurrences grouped by paths
     */
    public getAllFiles(): FilesByPath {
        return this.files
    }

    /**
     * Returns the gather folders grouped by paths
     */
    public getAllFolders(): FoldersByPath {
        return this.folders
    }

    private addFileWithOccurrence(filePath: string, occurrence?: number) {
        const file = new File(filePath)
        const parentFolderPath = file.getParentFolderPath()

        this.ensureFolderPathExists(parentFolderPath)
        this.ensureFileExistsInStorage(file)

        const folder = this.getFolderByPath(parentFolderPath)
        folder.addFile(file)

        this.increaseOccurrenceByPath(filePath, occurrence)
    }

    private getFileByPath(filePath: string): File {
        const file = this.findFileByPath(filePath)
        if (!file) {
            throw new Error(`file could not be found at: ${filePath}`)
        }
        return file
    }



    private getFolderByPath(folderPath: string): Folder {
        const folder = this.findFolderByPath(folderPath)
        if (!folder) {
            throw new Error(`folder could not be found at: ${folderPath}`)
        }

        return folder
    }

    private removeFileByPath(filePath: string) {
        delete this.files[filePath]
    }

    private removeFolderByPath(folderPath: string) {
        delete this.folders[folderPath]
    }

    private findFileByPath(filePath: string): File | undefined {
        return this.files[filePath]
    }




    private ensureFolderPathExists(folderPath: string) {

        const wantedFolder = this.folders[folderPath]
        if (wantedFolder) {
            return
        }

        const folderNames = folderPath
            .split(path.sep)
            .filter((name) => !!name)

        const pathGrow: string[] = []
        let parentFolder: Folder = this.root
        for (const folderName of folderNames) {
            pathGrow.push(folderName)
            let childFolder = parentFolder.findFolderByName(folderName)
            if (!childFolder) {
                const newPath = pathGrow.join(path.sep)
                childFolder = this.makeFolder(folderName, newPath)
                parentFolder.addFolder(childFolder)

            }
            parentFolder = childFolder
        }
    }

    //
    // maybe just path and we can extract the name
    //  + fewer parameters
    //  - slower performance
    private makeFolder(name: string, folderPath: string): Folder {
        const folder = new Folder(name)
        folder.onFolderRemove(this.removeFolderIfEmpty.bind(this, folder, folderPath))
        folder.onFileRemove(this.removeFolderIfEmpty.bind(this, folder, folderPath))

        this.folders[folderPath] = folder



        return folder
    }

    private removeFolderIfEmpty(folder: Folder, folderPath: string) {
        if (!folder.isEmpty()) {
            return
        }

        this.removeFolderByPath(folderPath)

    }

    private ensureFileExistsInStorage(file: File) {
        const filePath = file.getPath()
        if (!this.files[filePath]) {
            this.files[filePath] = file
        }
    }

    private increaseOccurrenceByPath(filePath: string, byNumber: number = 1) {
        const file = this.files[filePath]
        file.inc(byNumber)
    }

}

interface FilesByPath {
    [filePath: string]: File
}
interface FoldersByPath {
    [folderPath: string]: Folder
}
