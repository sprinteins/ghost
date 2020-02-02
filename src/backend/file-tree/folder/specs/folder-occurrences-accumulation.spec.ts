import { expect } from 'chai'
import { describe, it } from 'mocha'
import { Folder } from '..'
import { File } from '../../file/file'

describe('Module: File Tree / Folder', () => {

    describe('Adding folders with occurrences to folders', () => {

        const folderOccAccTests: Test[] = [
            {
                desc: 'no child folder',
                folderOccurrences: [],
                expectedFolderOccurrence: 0,
            },
            {
                desc: 'child folders\' occurrences count against parent folders\' occurrences (single)',
                folderOccurrences: [
                    {
                        name: 'public',
                        occurrenceAfterAddition: 1,
                        occurrenceBeforeAddition: 1,
                    },
                ],
                expectedFolderOccurrence: 2,
            },
            {
                desc: 'adding the same folder leaves occurrences the same',
                folderOccurrences: [
                    {
                        name: 'public',
                        occurrenceAfterAddition: 1,
                        occurrenceBeforeAddition: 2,
                    },
                    {
                        name: 'public',
                    },
                ],
                expectedFolderOccurrence: 3,
            },
            {
                desc: 'child folders\' occurrences count against parent folders\' occurrences (multiple)',
                folderOccurrences: [
                    {
                        name: 'public',
                        occurrenceAfterAddition: 1,
                        occurrenceBeforeAddition: 2,
                    },
                    {
                        name: 'src',
                        occurrenceAfterAddition: 3,
                        occurrenceBeforeAddition: 4,
                    },
                ],
                expectedFolderOccurrence: 10,
            },
        ]

        folderOccAccTests.forEach(testFolderOccAcc)

        function testFolderOccAcc(t: Test) {
            it(t.desc, () => {
                const root = new Folder('/')

                t.folderOccurrences.forEach((occ) => {
                    const childFolder = new Folder(occ.name)
                    incFolderOccurrence(childFolder, occ.occurrenceBeforeAddition)
                    root.addFolder(childFolder)
                    incFolderOccurrence(childFolder, occ.occurrenceAfterAddition)
                })

                expect(root.getOccurrences()).to.be.equal(t.expectedFolderOccurrence)

            })
        }

        function incFolderOccurrence(f: Folder, occ?: number) {
            if (occ === undefined) {
                return
            }

            const file = new File('/public/index.html')
            file.inc(occ)
            f.addFile(file)
        }
    })




    interface Test {
        desc: string
        folderOccurrences: FolderOcc[]
        expectedFolderOccurrence: number
    }

    interface FolderOcc {
        name: string
        occurrenceBeforeAddition?: number
        occurrenceAfterAddition?: number
    }

})

