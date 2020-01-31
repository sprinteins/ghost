import { describe, it } from 'mocha'
import { expect } from 'chai'
import { File } from '..'

describe('Module: File Tree / File', () => {

    describe('Occurrences', () => {

        const occurrencesTests: Test[] = [
            {
                desc: 'no occurrence',
                occurrenceIncreases: [0],
                expectedEndOccurrences: 0,
            },
            {
                desc: 'single occurrence',
                occurrenceIncreases: [1],
                expectedEndOccurrences: 1
            },
            {
                desc: 'multiple occurrences',
                occurrenceIncreases: [4],
                expectedEndOccurrences: 4
            },
            {
                desc: 'increasing occurrences',
                occurrenceIncreases: [4, 6],
                expectedEndOccurrences: 10
            },
        ]

        occurrencesTests.forEach(testOccurrences)

        function testOccurrences(t: Test) {
            it(t.desc, () => {
                const f = new File('/public/index.html')

                t.occurrenceIncreases
                    .forEach(inc => f.inc(inc))

                expect(f.getOccurrences()).to.be.equal(t.expectedEndOccurrences)


            })
        }
    })




    interface Test {
        desc: string
        occurrenceIncreases: number[]
        expectedEndOccurrences: number
    }

})

