import * as path from 'path'
import { BlockType, FileBlock, log, ViewType } from '../../common'
import { FileTree } from '../file-tree'
import { File } from '../file-tree/file'
import { Folder } from '../file-tree/folder'



export class Locator {

    private cwd: Folder
    private currentPath: string

    constructor(
        private fileTree: FileTree,
        private rootFolderPath: string,
        private viewType: ViewType,
    ) {
        this.cwd = this.fileTree.getRoot()
        this.changeToRoot()
    }

    public changeToRoot() {
        this.changeDirector('')
    }

    public changeDirector(folderPath: string) {
        const cwd = this.fileTree.findFolderByPath(folderPath)

        if (!cwd) {
            throw new Error('could not change directory to: ' + folderPath)
        }

        this.cwd = cwd
        this.currentPath = folderPath

    }

    public getCurrentLocation(): Location {
        return {
            blocks: this.generateFileBlocks(),
            path: this.currentPath,
            root: this.getRootName(),
        }
    }


    private getRootName(): string {
        const pathObj = path.parse(this.rootFolderPath)
        return pathObj.base
    }

    private generateFileBlocks(): FileBlock[] {

        // TODO: no-if-edge-cases
        if (this.viewType === ViewType.List) {
            return Object.values(this.fileTree.getAllFiles()).map(this.mapFileToBlockWithPath)
        }

        const folderBlocks: FileBlock[] = this.cwd.getFolders().map(this.mapFolderToBlock)
        const fileBlocks: FileBlock[] = this.cwd.getFiles().map(this.mapFileToBlock)

        return [].concat(folderBlocks, fileBlocks)

    }

    private mapFolderToBlock(folder: Folder): FileBlock {
        return new FileBlock(folder.name, folder.getOccurrences(), BlockType.Folder)
    }

    private mapFileToBlock(file: File): FileBlock {
        return new FileBlock(file.getName(), file.getOccurrences(), BlockType.File)
    }

    private mapFileToBlockWithPath(file: File): FileBlock {
        log.debug('filePath:', file.getPath())
        return new FileBlock(file.getPath(), file.getOccurrences(), BlockType.File)
    }


}


/**
 * Location containes:
 * - the current files and folders
 * - the path to the current folder
 *
 * @example
 * {
 *   path: 'src/foo/bar',
 *   blocks: [...]
 * }
 */
export interface Location {
    root: string
    path: string
    blocks: FileBlock[]
}
