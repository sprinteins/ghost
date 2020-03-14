import { expect } from 'chai'
import { describe, it } from 'mocha'
import { inspect } from 'util'
import { FileTree } from '../file-tree'
import { File } from '../file/file'
import { TestFile } from './test-file'



describe('Module: FileTree / Moving Files Effect on Occurrences', () => {

    const movingFilesTests: Test[] = [
        {
            desc: 'renaming files only counts new file',
            initialOccurrences: ['src/public/index.html'],
            movements: [
                {
                    old: 'src/public/index.html',
                    new: 'public/index.html',
                },
            ],
            expectedFiles: { 'public/index.html': new TestFile('public/index.html', 2) },
        },
        {
            desc: 'renaming files with multiple occurrence adds to the new file',
            initialOccurrences: ['src/public/index.html', 'src/public/index.html'],
            movements: [{
                old: 'src/public/index.html',
                new: 'public/index.html',
            }],
            expectedFiles: { 'public/index.html': new TestFile('public/index.html', 3) },
        },
        {
            desc: 'multiple movements count only the last one',
            initialOccurrences: ['src/public/index.html'],
            movements: [
                {
                    old: 'src/public/index.html',
                    new: 'public/index.html',
                },
                {
                    old: 'public/index.html',
                    new: 'www/index.html',
                },
            ],
            expectedFiles: { 'www/index.html': new TestFile('www/index.html', 3) },
        },
        {
            desc: 'create file if old one not found',
            initialOccurrences: [],
            movements: [
                {
                    old: 'public/index.html',
                    new: 'www/index.html',
                },
            ],
            expectedFiles: { 'www/index.html': new TestFile('www/index.html', 1) },
        },
    ]

    movingFilesTests.forEach(testMovingFiles)


    function testMovingFiles(t: Test) {
        it(t.desc, () => {
            const ft = new FileTree()
            t.initialOccurrences.forEach((path) => ft.addFile(path))
            t.movements.forEach((movement) => ft.move(movement.old, movement.new))
            const occurrences = ft.getAllFiles()

            // somehow `occurrences` and `exceptedOccurrences` are not equal
            // this way only the content is compared
            const occObj = JSON.parse(JSON.stringify(occurrences))
            const expectedOccObj = JSON.parse(JSON.stringify(t.expectedFiles))
            expect(occObj).to.be.deep.equal(expectedOccObj)

        })
    }


    interface Test {
        desc: string,
        initialOccurrences: string[],
        movements: {
            old: string,
            new: string,
        }[],
        expectedFiles: {
            [path: string]: File,
        },
    }

})
