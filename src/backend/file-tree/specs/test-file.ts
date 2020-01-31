import { File } from "../file/file"

export class TestFile extends File {
    constructor(filePath: string, occurrence: number) {
        super(filePath)
        this.inc(occurrence);
    }
}
