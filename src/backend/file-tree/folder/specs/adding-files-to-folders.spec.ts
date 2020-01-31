import { describe, it } from "mocha"
import { Folder } from ".."
import { expect } from "chai";
import { File } from "../../file/file";
import * as path from "path"

describe("Module: File Tree / Folder", () => {

    describe("Adding Files to Folder", () => {

        const folderFileRelTests: Test[] = [
            {
                desc: "no file",
                filePaths: []
            },
            {
                desc: "single file",
                filePaths: ["/public/index.html"]
            },
            {
                desc: "multiple files",
                filePaths: [
                    "/public/index.html",
                    "/public/style.css",
                ]
            },
        ]

        folderFileRelTests.forEach(testFolderFileRel)

        function testFolderFileRel(t: Test) {
            it(t.desc, () => {
                const folder = new Folder(t.desc)
                t.filePaths.forEach(path => {
                    const file = new File(path)
                    folder.addFile(file)
                })

                const foundFiles = folder.getFiles()
                expect(foundFiles).to.have.length(t.filePaths.length)

                t.filePaths.forEach(filePath => {
                    const name = path.parse(filePath).base
                    const foundFile = folder.findFileByName(name)
                    expect(foundFile).to.be.an.instanceof(File)
                })

            })
        }
    })




    interface Test {
        desc: string;
        filePaths: string[]
    }

})

