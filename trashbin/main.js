'use strict';

const electron = require('electron');
const app = electron.app;  // Module to control application life.
const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.

//Modules
//var ipc = electron.ipcMain; //required to exchange data between windows

// Windows (declare them globally or they will be closed by the garbage collector)
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// When Electron has finished initialization, create main window.
app.on('ready', function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 1024, height: 768});

  // and load the main.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/main.html');

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});