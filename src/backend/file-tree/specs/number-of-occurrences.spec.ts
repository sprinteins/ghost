import { describe, it } from "mocha"
import { expect } from "chai"
import { FileTree } from "../file-tree"
import { TestFile } from "./test-file"

describe("Module: FileTree / Number of Occurrence", () => {

    const numberOfOccurrencesTests: Test[] = [
        {
            desc: "add file once counts as one",
            paths: ["index.html"],
            exceptedOccurrences: { "index.html": new TestFile("index.html", 1) }
        },
        {
            desc: "add files twice counts as two",
            paths: ["index.html", "index.html"],
            exceptedOccurrences: { "index.html": new TestFile("index.html", 2) }
        }
    ]

    numberOfOccurrencesTests.forEach(testNumberOfOccurrences)


    function testNumberOfOccurrences(t: Test) {
        it(t.desc, () => {
            const ft = new FileTree()
            t.paths.forEach(path => ft.addFile(path))
            const occurrences = ft.getAllFiles()

            // somehow `occurrences` and `exceptedOccurrences` are not equal
            // this way only the content is compared
            const occObj = JSON.parse(JSON.stringify(occurrences))
            const expectedOccObj = JSON.parse(JSON.stringify(t.exceptedOccurrences))

            expect(occObj).to.be.deep.equal(expectedOccObj)

        })
    }


    interface Test {
        desc: string,
        paths: string[],
        exceptedOccurrences: {
            [path: string]: TestFile
        }
    }

})

