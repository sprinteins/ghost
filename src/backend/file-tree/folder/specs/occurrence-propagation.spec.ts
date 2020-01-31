import { describe, it } from 'mocha'
import { Folder } from '..'
import { expect } from 'chai'
import { File } from '../../file/file'

describe('Module: File Tree / Folder', () => {

    describe('Adding folders propagate their occurrences', () => {

        const occPropagationTests: Test[] = [
            {
                desc: 'no child folder, no occurrence',
                childrenLevelOccurrences: [],
                expectedRootOccurrences: 0
            },
            {
                desc: 'parent has same occurrences as single child folder',
                childrenLevelOccurrences: [1],
                expectedRootOccurrences: 1
            },
            {
                desc: 'multiple level\'s occurrences propagate and accumulate to top',
                childrenLevelOccurrences: [4, 2, 8],
                expectedRootOccurrences: 14
            },
        ]

        occPropagationTests.forEach(testOccPropagation)

        function testOccPropagation(t: Test) {
            it(t.desc, () => {
                const root = new Folder('/')
                let parent: Folder = root
                for (const occ of t.childrenLevelOccurrences) {
                    const childFolder = new Folder('child')
                    const file = new File('/public/index.html')
                    file.inc(occ)
                    childFolder.addFile(file)
                    parent.addFolder(childFolder)
                    parent = childFolder
                }

                expect(root.getOccurrences()).to.be.equal(t.expectedRootOccurrences)

            })
        }




    })




    interface Test {
        desc: string
        childrenLevelOccurrences: number[]
        expectedRootOccurrences: number
    }

})

