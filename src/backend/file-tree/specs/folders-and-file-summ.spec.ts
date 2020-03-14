import { expect } from 'chai'
import { describe, it } from 'mocha'
import { FileTree } from '../file-tree'
import { FileMovement } from '../../git/file-movement'
import { FileChanges } from '../../git/file-changes'
import { TestFile } from './test-file'
import { File } from '../file/'

describe('Module: FileTree / Folder and Files sum', () => {

    const folderFileSumTests: Test[] = [
        {
            desc: 'single file',
            initPath: ['src/index.html'],
            duos: [
                new FileChanges("public/index.html", "_"),
            ],
            expectedFiles: {
                'public/index.html': new TestFile('public/index.html', 1)
            },
            expectedFolderOcc: {
                "": 1,
                'public': 1
            },
        },
        {
            desc: 'single file moved',
            initPath: ['src/index.html'],
            duos: [
                new FileChanges("public/index.html", "_"),
                new FileMovement("public/index.html", "www/index.html", "_")
            ],
            expectedFiles: {
                'www/index.html': new TestFile('www/index.html', 2)
            },
            expectedFolderOcc: {
                '': 2,
                'www': 2
            },
        },
        {
            desc: 'single file with multiple occ, moved',
            initPath: ['src/index.html'],
            duos: [
                new FileChanges("public/index.html", "_"),
                new FileChanges("public/index.html", "_"),
                new FileMovement("public/index.html", "www/index.html", "_")
            ],
            expectedFiles: {
                'www/index.html': new TestFile('www/index.html', 3)
            },
            expectedFolderOcc: {
                "": 3,
                'www': 3
            },
        },
        {
            desc: 'first move, than change',
            initPath: ['src/index.html'],
            duos: [
                new FileMovement("public/index.html", "www/index.html", "_"),
                new FileChanges("www/index.html", "_"),
            ],
            expectedFiles: {
                'www/index.html': new TestFile('www/index.html', 2)
            },
            expectedFolderOcc: {
                "": 2,
                'www': 2
            },
        },
        {
            desc: 'moving files out of folder decreases no of occurences',
            initPath: ['src/index.html'],
            duos: [
                new FileChanges("public/index.html", "_"),
                new FileChanges("public/style.css", "_"),
                new FileMovement("public/index.html", "www/index.html", "_"),
            ],
            expectedFiles: {
                'www/index.html': new TestFile('www/index.html', 2),
                'public/style.css': new TestFile('public/style.css', 1),
            },
            expectedFolderOcc: {
                "": 3,
                'www': 2,
                "public": 1,
            },
        },
    ]

    folderFileSumTests.forEach(testFolderFileSum)


    function testFolderFileSum(t: Test) {
        it(t.desc, () => {
            const ft = new FileTree()

            t.duos.forEach((duo) => {
                if (duo instanceof FileChanges) {
                    ft.addFile(duo.path)
                }

                if (duo instanceof FileMovement) {
                    ft.move(duo.oldPath, duo.newPath)
                }
            })


            const occFiles = ft.getAllFiles()
            // somehow `occurrences` and `exceptedOccurrences` are not equal
            // this way only the content is compared
            const occFilesObj = JSON.parse(JSON.stringify(occFiles))
            const expOccFilesObj = JSON.parse(JSON.stringify(t.expectedFiles))
            expect(occFilesObj).to.be.deep.equal(expOccFilesObj)


            const folders = ft.getAllFolders()
            const folderOcc = Object
                .keys(folders)
                .reduce((folderOccMap: FolderOccurences, path) => {
                    const folder = folders[path]
                    folderOccMap[path] = folder.getOccurrences()
                    return folderOccMap
                }, {})

            expect(folderOcc).to.be.deep.equal(t.expectedFolderOcc)

        })

    }


    interface Test {
        desc: string,
        initPath: string[],
        duos: Duo[]
        expectedFiles: { [path: string]: File },
        expectedFolderOcc: FolderOccurences,
    }

    type FolderOccurences = { [path: string]: number }
    type Duo = FileMovement | FileChanges

})
