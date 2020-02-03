
let FORMAT: Format = 'short'
type Format = 'short' | 'long' | 'none'

export const log = {
    info: makeLog('ℹ️ '),
    debug: makeLog('🐞 '),
    error: makeError('🔥 '),
}

export function setFormat(format: Format) {
    FORMAT = format
}

function makeLog(prefix: string) {
    return (...content: any[]) => {
        console.log(`${prefix} ${getCallerSource()}:`, ...content)
    }
}

function makeError(prefix: string) {
    return (...content: any[]) => {
        console.error(`${prefix} ${getCallerSource()}:`, ...content)
    }
}

function getCallerSource() {
    const obj: { stack: string } = { stack: '' }
    Error.captureStackTrace(obj, getCallerSource)
    const lastCall = obj.stack.split('\n')[2]
    const regexp = /\(.*\)/g
    const file = lastCall.match(regexp)

    if (!file) {
        return ''
    }

    const line = file[0].replace('(', '').replace(')', '')
    const path = line.split('/')
    const lastFile = path[path.length - 1]

    if (!lastFile) {
        return ''
    }

    if (FORMAT === 'none') {
        return ''
    }

    if (FORMAT === 'short') {
        return lastFile
    }

    return line
}
