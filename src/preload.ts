import * as electron from 'electron'

function onDOMContentLoaded() {
    writeVersions()
    const w = window as ExtendedWindow
    w.electron = electron
}

function writeVersions() {
    const replaceText = (selector: string, text: string) => {
        const element = document.getElementById(selector)
        if (element) {
            element.innerText = text
        }
    }

    for (const type of ['chrome', 'node', 'electron']) {
        replaceText(`${type}-version`, (process.versions as any)[type])
    }
}

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', onDOMContentLoaded)

export interface WindowWithElectron extends Window {
    electron: typeof electron
}

export type ExtendedWindow = WindowWithElectron & typeof globalThis
