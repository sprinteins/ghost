import electron from 'electron';

import { spawn } from 'child_process';
const { remote } = electron;
const { dialog } = remote;

function init() {
  window.bridge = {
    electron,
    spawn,
    dialog,
    //@ts-ignore
    BrowserWindow: remote.BrowserWindow,
    remote,
    isDev: process.env.ELECTRON_START_URL ? true : false,
    rootDir: __dirname,
    devUrl: process.env.ELECTRON_START_URL || '',
  };
}

init();
