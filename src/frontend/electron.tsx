import * as electron from 'electron'

export function getElectron() {
    const w = window as ExtendedWindow
    return w.electron
}

interface WindowWithElectron extends Window {
    electron: typeof electron
}

type ExtendedWindow = WindowWithElectron & typeof globalThis


