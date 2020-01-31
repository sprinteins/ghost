import { describe, it } from "mocha"
import { Folder } from ".."
import { expect } from "chai";
import { File } from "../../file/file";

describe("Module: File Tree / Folder", () => {

    describe("File Occurrences accumulated in Folders", () => {

        const folderFileRelTests: Test[] = [
            {
                desc: "no file",
                fileOccurrences: [],
                expectedFolderOccurrence: 0
            },
            {
                desc: "file occurrences calculated before added to folder",
                fileOccurrences: [
                    {
                        path: "/public/index.html",
                        occurrenceBeforeAddition: 2
                    }
                ],
                expectedFolderOccurrence: 2
            },
            {
                desc: "file occurrences calculated after added to folder",
                fileOccurrences: [
                    {
                        path: "/public/index.html",
                        occurrenceAfterAddition: 2
                    }
                ],
                expectedFolderOccurrence: 2
            },
            {
                desc: "file occurrences calculated before and after added to folder",
                fileOccurrences: [
                    {
                        path: "/public/index.html",
                        occurrenceBeforeAddition: 2,
                        occurrenceAfterAddition: 2,
                    }
                ],
                expectedFolderOccurrence: 4
            },
            {
                desc: "negative occurrences decrease folder's occurrences",
                fileOccurrences: [
                    {
                        path: "/public/index.html",
                        occurrenceBeforeAddition: 4,
                        occurrenceAfterAddition: -1,
                    }
                ],
                expectedFolderOccurrence: 3
            },
        ]

        folderFileRelTests.forEach(testFolderFileRel)

        function testFolderFileRel(t: Test) {
            it(t.desc, () => {
                const f = new Folder("/")

                t.fileOccurrences.forEach(occ => {
                    const file = new File(occ.path);

                    incFileChanges(file, occ.occurrenceBeforeAddition)
                    f.addFile(file)
                    incFileChanges(file, occ.occurrenceAfterAddition)
                })

                expect(f.getOccurrences()).to.be.equal(t.expectedFolderOccurrence)

            })
        }
    })


    function incFileChanges(f: File, occ?: number) {
        if (occ !== undefined) {
            f.inc(occ);
        }
    }


    interface Test {
        desc: string;
        fileOccurrences: FileOcc[];
        expectedFolderOccurrence: number;
    }

    interface FileOcc {
        path: string
        occurrenceBeforeAddition?: number
        occurrenceAfterAddition?: number
    }

})

