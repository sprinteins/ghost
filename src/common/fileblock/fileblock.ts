export class FileBlock {

    constructor(
        readonly name: string,
        readonly noOfOccurrence: number,
        readonly type: BlockType,
    ) { }
}


export enum BlockType {
    File = 'FILE',
    Folder = 'FOLDER',
}
