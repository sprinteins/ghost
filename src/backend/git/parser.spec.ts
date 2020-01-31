import { describe, it } from "mocha"
import { FileChanges } from "./file-changes"
import { parse, LineNotParsable } from "./parser"
import { expect } from "chai"
import { FileMovement } from "./file-movement"


describe("Module: Parser", () => {

    describe("File Occurrence", () => {
        const fileOccurrenceTests: TestCase[] = [
            {
                desc: "returns file path for normal occurrence",
                line: "19\t0\tsrc/App.tsx",
                fileOccurrence: new FileChanges("src/App.tsx")
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

    describe("File Movement", () => {
        const fileMovementTests: Test[] = [
            {
                desc: "can detect movement at the beginning of path",
                line: "-\t-\t{assets => public/assets}/favicon.ico",
                fileMovement: new FileMovement("assets/favicon.ico", "public/assets/favicon.ico")
            },
            {
                desc: "can detect movement at the end of path",
                line: "-\t-\tpublic/assets/{favicon.ico => favicon2.ico}",
                fileMovement: new FileMovement("public/assets/favicon.ico", "public/assets/favicon2.ico")
            },
            {
                desc: "can detect movement in the middle of the path",
                line: "-\t-\tpublic/{assets => assets2}/favicon.ico",
                fileMovement: new FileMovement("public/assets/favicon.ico", "public/assets2/favicon.ico")
            },
        ]

        fileMovementTests.forEach(testFileMovement)


        function testFileMovement(t: Test) {
            it(t.desc, () => {
                const parsedLine = parse(t.line)
                expect(parsedLine).to.be.a.instanceOf(FileMovement)
                expect(parsedLine).to.be.deep.equal(t.fileMovement)
            })
        }

        interface Test {
            desc: string,
            line: string,
            fileMovement: FileMovement,
        }

    })

    describe("Not Parsable Line", () => {
        const notParsableLineTests: Test[] = [
            {
                desc: "date is not parsable",
                line: "Mon, 13 Aug 2019 23:35:19 +0200",
            },
            {
                desc: "Ehti' birthday is not parsable",
                line: "Mon, 12 Aug 2019 23:35:19 +0200",
            },
            {
                desc: "empty line is not parsable",
                line: "",
            },
            {
                desc: "only space in the line is not parsable",
                line: "  ",
            },
            {
                desc: "only tab in the line is not parsable",
                line: "\t",
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


