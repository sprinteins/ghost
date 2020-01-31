import { describe, it } from "mocha"
import { expect } from "chai"
import { FileTree } from "../file-tree"

describe("Module: FileTree / Moving Files Affects Folders", () => {

    const movingFilesTests: Test[] = [
        {
            desc: "empty folder gets removed",
            initPath: ["src/index.html"],
            movements: [
                {
                    old: "src/index.html",
                    new: "public/index.html",
                }
            ],
            folderToFindExclusively: ["public"]
        },
    ]

    movingFilesTests.forEach(testMovingFiles)


    function testMovingFiles(t: Test) {
        it(t.desc, () => {
            const ft = new FileTree()
            t.initPath.forEach(path => ft.addFile(path))
            t.movements.forEach(movement => ft.move(movement.old, movement.new))

            const folders = ft.getAllFolders()
            const folderPaths = Object.keys(folders);
            expect(folderPaths).to.include.members(t.folderToFindExclusively)
            expect(folderPaths).to.have.length(t.folderToFindExclusively.length)

        })
    }


    interface Test {
        desc: string,
        initPath: string[],
        movements: {
            old: string,
            new: string
        }[],
        folderToFindExclusively: string[]
    }

})
