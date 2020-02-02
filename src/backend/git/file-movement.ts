export class FileMovement {
    constructor(
        readonly oldPath: string,
        readonly newPath: string,
        readonly line: string,
    ) { }
}
