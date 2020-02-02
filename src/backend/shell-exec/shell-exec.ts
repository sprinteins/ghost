
import { ChildProcessWithoutNullStreams, spawn } from 'child_process'




export async function exec(cmd: string, path: string): Promise<string> {
    // console.log('running command:', cmd)
    const sh = 'sh'
    try {
        const proc = spawn(sh, ['-c', cmd], { cwd: path })
        const result = await captureOutput(proc)
        return result
    } catch (err) {
        console.error(`🔥 ${err}`)
    }

    return ''
}

function captureOutput(proc: ChildProcessWithoutNullStreams): Promise<string> {
    return new Promise((resolve, reject) => {
        let output = ''
        proc.stdout.on('data', (data) => {
            output += data.toString()
        })

        proc.on('close', (code) => {
            if (code !== 0) {
                reject(`child process exited with code ${code}`)
                return
            }

            resolve(output)
        })
    })

}
