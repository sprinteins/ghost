import path from 'path';
import { app, BrowserWindow } from 'electron';

import url from 'url';

/*
  load React-Dev-Server or build
*/
const REACT_URL =
  process.env.ELECTRON_START_URL ||
  url.format({
    // when building, the public folder and backend folder get merged build/index.html and build/backend/..
    pathname: path.join(__dirname, '../index.html'),
    protocol: 'file:',
    slashes: true,
  });

let mainWindow: Electron.BrowserWindow | null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // devTools: false,
      nodeIntegration: process.env.NODE_ENV === 'test' ? true : false,
      preload: path.resolve(path.join(__dirname, 'preload.js')),
      webSecurity: false,
    },
    show: false,
  });
  mainWindow.maximize();

  mainWindow.loadURL(REACT_URL);
  mainWindow.once('ready-to-show', () => {
    mainWindow!.show();
  });

  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  // if (process.platform !== 'darwin') {
  app.quit();
  // }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});