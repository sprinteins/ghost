// Basic init
const electron = require('electron');
const electronReload = require('electron-reload');

const { app, BrowserWindow } = electron;
const path = require('path');
const url = require('url');

// Let electron reloads by itself when webpack watches changes in ./app/
if (process.env.ELECTRON_START_URL) {
  electronReload(__dirname);
}

// To avoid being garbage collected
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // devTools: false,
      nodeIntegration: true,
      preload: path.resolve(path.join(__dirname, 'preload.js')),
    },
    show: false,
  });
  mainWindow.maximize();

  const startUrl = process.env.ELECTRON_START_URL
    || url.format({
      pathname: path.join(__dirname, './build/index.html'),
      protocol: 'file:',
      slashes: true,
    });

  mainWindow.loadURL(startUrl);
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
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
