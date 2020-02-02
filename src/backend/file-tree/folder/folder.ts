import { EventEmitter } from 'events'
import { inspect } from 'util'
import { File } from '../file/file'


// class MyEmitter extends EventEmitter {

// }

enum Events {
    FileRemoved = 'FileRemoved',
    FolderRemoved = 'FolderRemoved',
}
export class Folder {
    public static Events = Events

    public readonly name: string

    private occurrences: number = 0
    private onIncFn: OnInc = noopOnInc

    private filesMap: { [fileName: string]: File } = {}
    private foldersMap: { [folderName: string]: Folder } = {}
    private files: File[] = []
    private folders: Folder[] = []

    private parent?: Folder
    private eventEmitter: EventEmitter = new EventEmitter()

    constructor(
        name: string,
        parent?: Folder,
    ) {
        this.name = name
        this.parent = parent
    }


    public getParent(): Folder | undefined {
        return this.parent
    }

    /**
     * A folder is empty if it has not files or child folders
     */
    public isEmpty(): boolean {
        return this.files.length === 0 && this.folders.length === 0
    }

    /**
     * Sets the callback function that gets called on occurrence increase
     * @param fn
     */
    public onInc(fn: OnInc) {
        this.onIncFn = fn
    }

    /**
     * Resets a the callback function
     */
    public offInc() {
        this.onInc(noopOnInc)
    }


    /**
     * Sets the callback to when a file is removed
     * @param fn
     */
    public onFileRemove(fn: OnFileRemove) {
        this.eventEmitter.on(Folder.Events.FileRemoved, fn)
    }


    /**
     * Resets the callback function
     */
    public offFileRemove(fn: OnFileRemove) {
        this.eventEmitter.off(Folder.Events.FileRemoved, fn)
    }

    /**
     * Sets the callback to when a folder is removed
     * @param fn
     */
    public onFolderRemove(fn: OnFolderRemove) {
        this.eventEmitter.on(Folder.Events.FolderRemoved, fn)
    }

    /**
     * Resets the callback function
     */
    public offFolderRemove(fn: OnFolderRemove) {
        this.eventEmitter.off(Folder.Events.FolderRemoved, fn)
    }

    public getOccurrences() {
        return this.occurrences
    }

    /**
     * Return all the child folders
     */
    public getFolders(): Folder[] {
        return this.folders
    }

    /**
     * Returns all the child files
     */
    public getFiles(): File[] {
        return this.files
    }

    /**
     * Looks for a file with the given name
     * If no file found returns undefined
     * @param name
     */
    public findFileByName(name: string): File | undefined {
        return this.filesMap[name]
    }

    /**
     * Looks for a file by given name
     * If nothing found returns undefined
     * @param name name of the wanted file
     */
    public findFolderByName(name: string): Folder | undefined {
        return this.foldersMap[name]
    }

    /**
     * Adds file as child file to the folder
     * @param f the file to add
     */
    public addFile(f: File) {
        this.filesMap[f.getName()] = f
        this.generateFiles()
        this.inc(f.getOccurrences())
        f.onInc(this.calcOccurrencesAtAddition.bind(this))
    }

    /**
     * Removes files as child
     * If the file was not already not a child of the folder
     * nothing happens
     *
     * Events:
     *  - onFileRemove(): void
     *
     * @param name name of the file to remove
     */
    public removeFileByName(name: string) {
        const file = this.filesMap[name]
        delete this.filesMap[name]
        this.generateFiles()
        this.eventEmitter.emit(Folder.Events.FileRemoved, file)
    }


    /**
     * Adds the given folder as a child folder
     * If there was already a folder with the same name it gets overwritten
     * @param folder the folder to add as child folder
     */
    public addFolder(folder: Folder) {
        this.foldersMap[folder.name] = folder
        this.generateFolders()

        folder.setParent(this)

        this.inc(folder.getOccurrences())
        folder.onInc(this.calcOccurrencesAtAddition.bind(this))
        folder.onFileRemove(this.removeFolderIfEmpty.bind(this, folder))
        folder.onFolderRemove(this.removeFolderIfEmpty.bind(this, folder))
    }

    /**
     * Removes the folder as child and sets the folder's parent to undefined
     * If the folder was already not a child nothing happens
     * @param name the name of the folder to remove
     */
    public removeFolderByName(name: string) {
        const folder = this.findFolderByName(name)
        if (!folder) {
            return
        }
        this.inc(-1 * folder.getOccurrences())
        folder.unsetParent()
        folder.offInc()
        delete this.foldersMap[name]
        this.generateFolders()
        this.eventEmitter.emit(Folder.Events.FolderRemoved)
    }

    /**
     * hasFolder returns true if the folder alredy has a child folder
     * by the given name
     * @param name name of the folder
     */
    public hasFolder(name: string): boolean {
        const hasFolder = this.findFolderByName(name) !== undefined
        return hasFolder
    }

    protected setParent(folder: Folder) {
        this.parent = folder
    }

    protected unsetParent() {
        this.parent = undefined
    }

    private calcOccurrencesAtAddition(from: number, to: number) {
        const diff = to - from
        this.inc(diff)
    }


    private inc(byNumber: number) {
        const from = this.getOccurrences()
        this.occurrences += byNumber
        const to = this.getOccurrences()

        this.onIncFn(from, to)
    }

    private generateFiles() {
        this.files = Object.values(this.filesMap)
    }

    private removeFolderIfEmpty(folder: Folder) {
        if (!folder.isEmpty()) {
            return
        }

        this.removeFolderByName(folder.name)

    }


    private generateFolders() {
        this.folders = Object.values(this.foldersMap)
    }

}

export type OnInc = (from: number, to: number) => void

export type OnFileRemove = (file: File) => void

export type OnFolderRemove = () => void

function noopOnInc(from: number, to: number) { }
