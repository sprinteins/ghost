import { expect } from 'chai'
import { describe, it } from 'mocha'
import { CommandBuilder } from './command-builder'

describe('Module: CommandBuilder', () => {

    const tests: Test[] = [
        {
            desc: 'returns command as string',
            cb: new CommandBuilder(),
        },
        {
            desc: 'Adds branch prefix without \'/\'',
            cb: new CommandBuilder().addBranchPrefix('feature'),
            shouldContain: ['feature/'],
        },
        {
            desc: 'Add branch prefix with \'/\'',
            cb: new CommandBuilder().addBranchPrefix('feature/'),
            shouldContain: ['feature/'],
            shouldNotContain: ['feature//'],
        },
    ]

    tests.forEach(testQueryBuilder)


    function testQueryBuilder(t: Test) {
        it(t.desc, () => {
            const command = t.cb.done()
            expect(command).to.be.a('string')

            if (t.shouldNotContain) {
                t.shouldContain.forEach((str: string) => {
                    const containsString = command.indexOf(str) >= 0
                    expect(
                        containsString,
                        `\nquery:\n--> ${command}\ndo NOT contain string:\n--> ${str}\n`,
                    ).to.be.true
                })
            }

            if (t.shouldNotContain) {
                t.shouldNotContain.forEach((str: string) => {
                    const containsString = command.indexOf(str) >= 0
                    expect(
                        containsString,
                        `\nquery:\n--> ${command}\nDOES contain string:\n--> ${str}\n`,
                    ).to.be.false
                })
            }

        })

    }

    interface Test {
        desc: string,
        cb: CommandBuilder,
        shouldContain?: string[],
        shouldNotContain?: string[],
    }

})

