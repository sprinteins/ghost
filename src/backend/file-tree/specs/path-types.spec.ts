import { expect } from 'chai'
import { describe, it } from 'mocha'
import { FileTree } from '../file-tree'
import { File } from '../file/file'
import { TestFile } from './test-file'

describe('Module: FileTree / Path Types', () => {

    const pathTypeTests: Test[] = [
        {
            desc: 'accepts file in root',
            paths: ['index.html'],
            exceptedOccurrences: { 'index.html': new TestFile('index.html', 1) },
        },
        {
            desc: 'accepts file in a folder',
            paths: ['public/www/index.html'],
            exceptedOccurrences: { 'public/www/index.html': new TestFile('public/www/index.html', 1) },
        },
    ]

    pathTypeTests.forEach(testPathTypes)


    function testPathTypes(t: Test) {
        it(t.desc, () => {
            const ft = new FileTree()
            t.paths.forEach((path) => ft.addFile(path))
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
            [path: string]: File,
        }
    }

})
