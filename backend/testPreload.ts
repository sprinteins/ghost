import electron from 'electron';
import { spawn, ChildProcess, SpawnOptions } from 'child_process';
import { join } from 'path';
// hack but something seems wrong with the types
// tslint:disable-next-line: no-any
const BrowserWindow: Electron.BrowserWindow = electron.BrowserWindow as any;
const { remote } = electron;
const { dialog } = remote;

function init() {
  window.bridge = {
    electron,
    //@ts-ignore
    spawn: chooseSpawn,
    dialog,
    BrowserWindow,
    remote,
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
