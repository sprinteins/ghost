import { expect } from 'chai'
import { describe, it } from 'mocha'
import { log, ViewType } from '../../common'
import { FileTree } from '../file-tree'
import { Locator } from './locator'

describe('Module: Locator', () => {

    describe('Locator changing directory', () => {

        const locatorTests: Test[] = [
            {
                desc: 'root-folder',
                filePaths: [
                    'public/index.html',
                    'public/assets/style.css',
                ],
                rootPath: 'user/project',
                cd: '',
                expectedPath: '',
                expectedRootName: 'project',
                expectedBlockNames: ['public'],
            },
            {
                desc: 'sub-folder',
                filePaths: [
                    'public/index.html',
                    'public/assets/style.css',
                ],
                rootPath: 'user/project',
                cd: 'public',
                expectedPath: 'public',
                expectedRootName: 'project',
                expectedBlockNames: ['assets', 'index.html'],
            },
        ]

        locatorTests.forEach(testLocator)

        function testLocator(t: Test) {
            it(t.desc, () => {
                const fileTree = new FileTree()
                t.filePaths.forEach((filePath) => {
                    fileTree.addFile(filePath)
                })
                const locator = new Locator(fileTree, t.rootPath, ViewType.Tree)
                locator.changeDirector(t.cd)

                const location = locator.getCurrentLocation()
                const names = location.blocks.map((block) => block.name)

                expect(location.path).to.equal(t.expectedPath)
                expect(location.root).to.equal(t.expectedRootName)
                expect(names).to.have.members(t.expectedBlockNames)


            })

        }
    })


    interface Test {
        desc: string
        filePaths: string[]
        rootPath: string,
        cd: string
        expectedBlockNames: string[]
        expectedPath: string
        expectedRootName: string
    }

})

