import { IpcMainEvent } from 'electron'



export function main() {
    console.log('starting backend')
}

export class Backend {

    runSomeNodeJSOnlyAPI(event: IpcMainEvent, ...args: any[]) {
        console.log('runs in node')
        // console.log("event:", event);
        console.log('args:', args)
    }
}