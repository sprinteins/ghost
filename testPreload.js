const { electron } = require('electron');
const { remote } = require('electron');
const { dialog } = require('electron').remote;
const { spawn } = require('child_process');
const { join } = require('path');
const { BrowserWindow } = require('electron').remote;

function init() {
  window.bridge = {
    electron,
    spawn: chooseSpawn,
    dialog,
    BrowserWindow,
    remote,
  };
}

init();

// it seems not possible to require local modules
function chooseSpawn(file, args, options) {
  switch (file) {
    case 'git':
      return spawn('node', [
        `${join(__dirname, 'test/mocks/git.js')}`,
        process.env.PRELOAD_GIT_MOCK_FILE,
      ]);
  }
}
