import { describe, it } from "mocha"
import { expect } from "chai";
import { FileTree } from "../file-tree";
import { exec } from "child_process";
import { Controller } from "./controller";
import { inspect } from "util";

describe("Module: Controller ", () => {

    describe("all the tests", () => {

        const occurrencesTests: Test[] = [
            {
                desc: "simple",
                lines: [
                    "0\t1\tpublic/index.html",
                ],
                expectedChanges: {
                    "public/index.html": 1,
                }
            },
            {
                desc: "with movement",
                lines: [
                    "0\t1\tpublic/index.html",
                    "-\t-\t{public => src}/index.html",
                ],
                expectedChanges: {
                    "src/index.html": 1
                }
            },
            {
                desc: "multiple level",
                lines: [
                    "0\t1\tpublic/www/site/index.html",
                    "-\t-\t{public/www/site => src/website/index}/index.html",
                ],
                expectedChanges: {
                    "src/website/index/index.html": 1
                },
            },
            {
                desc: "file rename",
                lines: [
                    "0\t1\tpublic/index.html",
                    "-\t-\tpublic/{index.html => start.html}",
                ],
                expectedChanges: {
                    "public/start.html": 1
                }
            }
        ]

        occurrencesTests.forEach(testOccurrences)

        function testOccurrences(t: Test) {
            it(t.desc, async () => {
                const exec = makeTestExec(t.lines)
                const ctrl = new Controller(exec)
                const fileTree = await ctrl.analyse("/")
                const actualFilePathChanges = mapFileTreeToFilePathChanges(fileTree);
                expect(actualFilePathChanges).to.be.deep.equal(t.expectedChanges)
            })
        }
    })

    interface Test {
        desc: string;
        lines: string[];
        expectedChanges: FilePathChanges;
        // expectedFileTree: FileTree;
    }

})

function makeTestExec(lines: string[]) {
    return function (cmd: string, path: string): Promise<string> {
        return new Promise((resolve) => {
            resolve(lines.join("\n"))
        })
    }
}

interface FilePathChanges {
    [path: string]: number
}

function mapFileTreeToFilePathChanges(fileTree: FileTree): FilePathChanges {
    const fileMap = fileTree.getAllFiles()
    const pathChanges = Object
        .keys(fileMap)
        .reduce(
            (newMap: FilePathChanges, path) => {
                const file = fileMap[path];
                newMap[path] = file.getOccurrences();
                return newMap;
            }, {}
        )

    return pathChanges

}