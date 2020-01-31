import * as path from 'path'

export class File {

    public readonly pathObj: path.ParsedPath

    private occurrences: number = 0
    private onIncFn: OnInc = noopOnInc

    constructor(
        readonly filePath: string,
    ) {
        this.pathObj = path.parse(filePath)
    }

    public onInc(fn: OnInc) {
        this.onIncFn = fn
    }

    /**
     * Increases the occurrence of a file either by simple one
     * or if needed by given number
     * @param byNumber
     */
    public inc(byNumber: number = 1) {
        const from = this.occurrences
        this.occurrences += byNumber
        const to = this.occurrences

        this.onIncFn(from, to)
    }

    /**
     * Returns the recorded number of occurrences
     */
    public getOccurrences(): number {
        return this.occurrences
    }

    /**
     * Returns the name component of the path
     * e.g.: /public/index.html => index.html
     */
    public getName(): string {
        return this.pathObj.base
    }

    /**
     * Returns the whole path of the file
     */
    public getPath(): string {
        return this.filePath
    }

    /**
     *  Returns the path to the parent folder
     */
    public getParentFolderPath(): string {
        return this.pathObj.dir
    }

}

export type OnInc = (from: number, to: number) => void

function noopOnInc(from: number, to: number) { }
