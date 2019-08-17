import electron from 'electron';

import { spawn } from 'child_process';
// hack but something seems wrong with the types
// tslint:disable-next-line: no-any
const browserWindow: Electron.BrowserWindow = electron.BrowserWindow as any;
const { remote } = electron;
const { dialog } = remote;

function init() {
  window.bridge = {
    electron,
    spawn,
    dialog,
    browserWindow,
    remote,
  };
}

init();
