import { spawn } from 'child_process';
declare global {
  interface Window {
    bridge: ElectronBridge;
  }
}
interface ElectronBridge {
  spawn: typeof spawn;
  electron: Electron.AllElectron;
  dialog: Electron.Dialog;
  browserWindow: Electron.BrowserWindow;
  remote: Electron.Remote;
}
