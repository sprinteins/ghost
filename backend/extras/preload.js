//ONLY ES5 HERE ! or add a webpack entry
const electron = require('electron');
const { spawn } = require('child_process');
const { remote } = electron;
const { dialog } = remote;

function init() {
  window.bridge = {
    electron,
    spawn,
    dialog,
    BrowserWindow: remote.BrowserWindow,
    remote,
    isDev: process.env.NODE_ENV === 'development' ? true : false,
    rootDir: __dirname,
    devUrl: process.env.ELECTRON_START_URL || '',
  };
}

init();
