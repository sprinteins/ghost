import path from 'path';
import { app, BrowserWindow } from 'electron';
import url from 'url';
import reload from './extras/reloader.js';
import dotenv from 'dotenv';

let config;
if (process.env.NODE_ENV === 'development') {
  //currently .env file just gets used for the ELECTRON_START_URL
  config = dotenv.config({ path: path.join(__dirname, '.env') }).parsed;
  console.log(config);
}
reload(__dirname);
/*
  load React-Dev-Server or build
*/
const REACT_URL =
  (config && config.ELECTRON_START_URL) ||
  url.format({
    // when building, the public folder and backend folder get merged build/index.html and build/backend/..
    pathname: path.join(__dirname, '../index.html'),
    protocol: 'file:',
    slashes: true,
  });

console.log(config);

let mainWindow: Electron.BrowserWindow | null;

function createWindow() {
  const createdWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // devTools: false,
      nodeIntegration: process.env.NODE_ENV === 'test',
      preload: path.resolve(path.join(__dirname, process.env.NODE_ENV === 'test' ? './testPreload.js' : './preload.js')),
    },
    show: false,
  });
  createdWindow.maximize();
  createdWindow.loadURL(REACT_URL);

  createdWindow.webContents.on('did-fail-load', () => {
    if (process.env.NODE_ENV === 'development') {
      createdWindow.loadURL(REACT_URL);
    }
  });
  createdWindow.once('ready-to-show', () => {
    createdWindow.show();
  });

  createdWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
  mainWindow = createdWindow;
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
