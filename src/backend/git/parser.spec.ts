import { expect } from 'chai'
import { describe, it } from 'mocha'
import { inspect } from 'util'
import { FileChanges } from './file-changes'
import { FileMovement } from './file-movement'
import { LineNotParsable, parse } from './parser'


describe('Module: Parser', () => {

    describe('File Occurrence', () => {
        const fileOccurrenceTests: TestCase[] = [
            {
                desc: 'returns file path for normal occurrence',
                line: '19\t0\tsrc/App.tsx',
                fileOccurrence: new FileChanges('src/App.tsx', '19\t0\tsrc/App.tsx'),
            },
        ]

        fileOccurrenceTests.forEach(testFileChanges)


        function testFileChanges(t: TestCase) {
            it(t.desc, () => {
                const parsedLine = parse(t.line)
                expect(parsedLine).to.be.a.instanceOf(FileChanges)
                expect(parsedLine).to.be.deep.equal(t.fileOccurrence)
            })
        }

        interface TestCase {
            desc: string,
            line: string,
            fileOccurrence: FileChanges,
        }

    })

    describe('File Movement', () => {
        const fileMovementTests: Test[] = [
            {
                desc: 'can detect movement at the beginning of path',
                line: '-\t-\t{assets => public/assets}/favicon.ico',
                fileMovement: new FileMovement(
                    'assets/favicon.ico',
                    'public/assets/favicon.ico',
                    '-\t-\t{assets => public/assets}/favicon.ico',
                ),
            },
            {
                desc: 'can detect movement at the end of path',
                line: '-\t-\tpublic/assets/{favicon.ico => favicon2.ico}',
                fileMovement: new FileMovement(
                    'public/assets/favicon.ico',
                    'public/assets/favicon2.ico',
                    '-\t-\tpublic/assets/{favicon.ico => favicon2.ico}',
                ),
            },
            {
                desc: 'can detect movement in the middle of the path',
                line: '-\t-\tpublic/{assets => assets2}/favicon.ico',
                fileMovement: new FileMovement(
                    'public/assets/favicon.ico',
                    'public/assets2/favicon.ico',
                    '-\t-\tpublic/{assets => assets2}/favicon.ico',
                ),
            },
            {
                desc: 'can detect movement with "0" instead "-" ',
                line: '0\t0\t{.vscode => email/.vscode}/launch.json',
                fileMovement: new FileMovement(
                    '.vscode/launch.json',
                    'email/.vscode/launch.json',
                    '0\t0\t{.vscode => email/.vscode}/launch.json',
                ),
            },
            {
                desc: 'can detect movement with "0" instead "-" ',
                line: '0\t0\ttechnical-data/deployment/{autoscale.json => autoscale.service.json}',
                fileMovement: new FileMovement(
                    'technical-data/deployment/autoscale.json',
                    'technical-data/deployment/autoscale.service.json',
                    '0\t0\ttechnical-data/deployment/{autoscale.json => autoscale.service.json}',
                ),
            },
        ]

        fileMovementTests.forEach(testFileMovement)


        function testFileMovement(t: Test) {
            it(t.desc, () => {
                const parsedLine = parse(t.line)
                expect(parsedLine, inspect(parsedLine)).to.be.a.instanceOf(FileMovement)
                expect(parsedLine).to.be.deep.equal(t.fileMovement)
            })
        }

        interface Test {
            desc: string,
            line: string,
            fileMovement: FileMovement,
        }

    })

    describe('Not Parsable Line', () => {
        const notParsableLineTests: Test[] = [
            {
                desc: 'date is not parsable',
                line: 'Mon, 13 Aug 2019 23:35:19 +0200',
            },
            {
                desc: 'Ehti\' birthday is not parsable',
                line: 'Mon, 12 Aug 2019 23:35:19 +0200',
            },
            {
                desc: 'empty line is not parsable',
                line: '',
            },
            {
                desc: 'only space in the line is not parsable',
                line: '  ',
            },
            {
                desc: 'only tab in the line is not parsable',
                line: '\t',
            },
        ]

        notParsableLineTests.forEach(testNotParsableLines)


        function testNotParsableLines(t: Test) {
            it(t.desc, () => {
                const parsedLine = parse(t.line)
                if (t.expectionFn && t.expectionFn(t.line)) {
                    return
                }
                expect(parsedLine).to.be.an.instanceof(LineNotParsable)

            })
        }

        interface Test {
            desc: string,
            line: string,
            expectionFn?: (line: string) => boolean
        }

    })
})


