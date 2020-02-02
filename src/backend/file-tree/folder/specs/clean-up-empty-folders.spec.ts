import { expect } from 'chai'
import { describe, it } from 'mocha'
import { Folder } from '..'
import { File } from '../../file/file'

describe('Module: File Tree / Folder', () => {

    describe('Clean up empty folders', () => {

        const cleanUpEmptyFoldersTests: Test[] = [
            {
                desc: 'empty child folder gets deleted',
            },
        ]

        cleanUpEmptyFoldersTests.forEach(testCleanUpEmptyFolders)

        function testCleanUpEmptyFolders(t: Test) {
            it(t.desc, () => {
                const root = new Folder('root')
                const child = new Folder('child')
                const file = new File('/root/child/index.html')

                child.addFile(file)
                root.addFolder(child)

                child.removeFileByName('index.html')
                const folders = root.getFolders()


                expect(folders).to.be.empty

            })
        }
    })




    interface Test {
        desc: string
    }

})

