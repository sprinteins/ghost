import { describe, it } from "mocha"
import { expect } from "chai"
import { FileTree } from "../file-tree"
import { TestFile } from "./test-file"
import { File } from "../file/file"
import { Folder } from "../folder"
import { inspect } from "util"

describe("Module: FileTree / Adding And Finding", () => {

    const addingAndFindingTests: Test[] = [
        {
            desc: "Folders can be accessed",
            filePath: "public/src/www/v1/index.html",
            foldersToFind: [
                "public",
                "public/src",
                "public/src/www",
                "public/src/www/v1",
            ]
        },
    ]

    addingAndFindingTests.forEach(testAddingAndFinding)


    function testAddingAndFinding(t: Test) {
        it(t.desc, () => {
            const ft = new FileTree()
            ft.addFile(t.filePath)

            t.foldersToFind.forEach(folderToFind => {
                const f = ft.findFolderByPath(folderToFind)
                expect(f, inspect(ft, undefined, 10, true)).to.be.an.instanceof(Folder)
            })

        })
    }


    interface Test {
        desc: string,
        filePath: string,
        foldersToFind: string[],
    }

})
