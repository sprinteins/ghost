import { expect } from 'chai'
import { describe, it } from 'mocha'
import { inspect } from 'util'
import { Folder } from '..'

describe('Module: File Tree / Folder', () => {

    describe('Folder-Folder Relationship', () => {

        const folderRelTests: Test[] = [
            {
                desc: 'one level, single child',
                folder: {
                    name: 'root',
                    folders: [{ name: 'child' }],
                },
            },
            {
                desc: 'one level, multiple children',
                folder: {
                    name: 'root',
                    folders: [
                        { name: 'child 1' },
                        { name: 'child 2' },
                    ],
                },
            },
            {
                desc: 'multiple levels, single child',
                folder: {
                    name: 'root',
                    folders: [
                        {
                            name: 'level-1 child',
                            folders: [{ name: 'level-2 child ' }],
                        },
                    ],
                },
            },
        ]

        folderRelTests.forEach(testFolderRel)

        function testFolderRel(t: Test) {
            it(t.desc, () => {
                const root = createFolder(t.folder)
                expectToHaveAllChildrenRecursive(root, t.folder)


            })
        }
    })

    function createFolder(tf: TestFolder): Folder {
        const folder = new Folder(tf.name)
        if (!tf.folders) {
            return folder
        }

        tf.folders
            .map((childFolder) => createFolder(childFolder))
            .forEach((childFolder) => folder.addFolder(childFolder))

        return folder
    }

    function expectToHaveAllChildrenRecursive(folder: Folder, testFolder: TestFolder) {
        if (!testFolder.folders) {
            return
        }

        testFolder.folders.forEach((childTestFolder) => {
            const childFolder = folder.findFolderByName(childTestFolder.name)
            expect(childFolder).to.be.an.instanceof(Folder)
            expectToHaveAllChildrenRecursive(childFolder, childTestFolder)

        })

    }


    interface Test {
        desc: string
        folder: TestFolder
    }

    interface TestFolder {
        name: string
        folders?: TestFolder[]
    }
})

