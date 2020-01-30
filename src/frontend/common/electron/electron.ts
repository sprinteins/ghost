import * as electronOriginal from 'electron'

export function getElectron() {
    const w = window as ExtendedWindow
    return w.electron
}

interface WindowWithElectron extends Window {
    electron: typeof electronOriginal
}

type ExtendedWindow = WindowWithElectron & typeof globalThis
