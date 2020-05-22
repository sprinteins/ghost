import { OpenRepoCommand } from '.'
import { log } from '..'

export function guardOpenRepoCommand(maybeORC: any): OpenRepoCommand {

    const keys = ['folderPath', 'query', 'viewType']

    const orc = maybeORC as OpenRepoCommand
    if (!orc || !hasRequiredKeys(orc, keys)) {
        const errorMsg = `wrong format for "OpenRepoCommand": ${orc}`
        log.error(errorMsg)
        throw new Error(errorMsg)
    }

    return orc
}


function hasRequiredKeys(obj: { [key: string]: any }, keys: string[]): boolean {
    return keys.every((key) => obj[key] !== undefined)
}
