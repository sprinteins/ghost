import { expect } from 'chai'
import { describe, it } from 'mocha'
import { exec } from './shell-exec'

describe('Module: cmd', () => {

    const cmdTests: Test[] = [
        {
            description: 'returns the output of the given command',

            cmd: 'echo Hello, World!',
            expectedOutput: 'Hello, World!\n',
        },
    ]

    cmdTests.forEach(testCmd)

    function testCmd(t: Test) {
        it(t.description, async () => {
            const output = await exec(t.cmd, '')
            expect(output).to.be.equal(t.expectedOutput)

        })
    }
})

interface Test {
    description: string,
    cmd: string,
    expectedOutput: string,
}
