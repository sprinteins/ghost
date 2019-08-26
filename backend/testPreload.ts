import electron from 'electron';
import { spawn, ChildProcess, SpawnOptions } from 'child_process';
import { join } from 'path';
const { remote } = electron;
const { dialog } = remote;

function init() {
  window.bridge = {
    electron,
    //@ts-ignore
    spawn: chooseSpawn,
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

// it seems to be not possible to require local modules
function chooseSpawn(command: string, args?: string[] | undefined, options?: SpawnOptions | undefined): ChildProcess {
  switch (command) {
    case 'git':
      const args: string[] = [`${join(__dirname, '../../test/mocks/git.js')}`, process.env.PRELOAD_GIT_MOCK_FILE!];
      return spawn('node', args, undefined);
    default:
      return spawn('node');
  }
}
