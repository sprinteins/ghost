//ONLY ES5 HERE ! or add a webpack entry

const electron = require('electron');
const { spawn } = require('child_process');
const { join } = require('path');
const { remote } = electron;
const { dialog } = remote;

function init() {
  window.bridge = {
    electron,
    spawn: chooseSpawn,
    dialog,
    BrowserWindow: remote.BrowserWindow,
    remote,
    isDev: process.env.NODE_ENV === 'development' ? true : false,
    rootDir: __dirname,
    devUrl: process.env.ELECTRON_START_URL || '',
  };
}

init();

function chooseSpawn(command) {
  switch (command) {
    case 'git':
      const args = [`${join(__dirname, '../../test/mocks/git.js')}`, process.env.PRELOAD_GIT_MOCK_FILE];
      return spawn('node', args, undefined);
    default:
      return spawn('node');
  }
}
