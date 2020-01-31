import { describe, it } from 'mocha'
import { expect } from 'chai'
import { File } from '..'

describe('Module: File Tree / File', () => {

    describe('Occurrences callback', () => {

        const occurrencesTests: Test[] = [
            {
                desc: 'single occurrence increase',
                occurrenceIncreases: [1],
                expectedStoreStates: [
                    { from: 0, to: 1 }
                ]
            },
            {
                desc: 'multiple occurrence increase',
                occurrenceIncreases: [3, 7],
                expectedStoreStates: [
                    { from: 0, to: 3 },
                    { from: 3, to: 10 },
                ]
            },
        ]

        occurrencesTests.forEach(testOccurrences)

        function testOccurrences(t: Test) {
            it(t.desc, () => {
                const f = new File('/public/index.html')

                t.occurrenceIncreases.forEach((occInc, index) => {
                    const store: occStore = { from: 0, to: 0 }

                    f.onInc(makeOnInc(store))

                    f.inc(occInc)

                    expect(store).to.be.deep.equal(t.expectedStoreStates[index])

                })

            })
        }
    })

    function makeOnInc(store: occStore) {
        return function (from: number, to: number) {
            store.from = from
            store.to = to
        }
    }

    interface occStore {
        from: number
        to: number
    }

    interface Test {
        desc: string
        occurrenceIncreases: number[]
        expectedStoreStates: occStore[]
    }

})

