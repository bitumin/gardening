'use strict';

const electron = require('electron');
const app = electron.app;  // Module to control application life.
const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.

//Modules
var ipc = electron.ipcMain;

// Windows (declare them globally or they will be closed by the garbage collector)
var mainWindow = null;
//var mainLeftMenuWindow = null;
//var mainContentWindow = null;

//var infoPlantWindow = null;
//var statsPlantWindow = null;
var insertPlantWindow = null;
var updatePlantWindow = null;
var deletePlantWindow = null;

//var infoChildWindow = null;
//var statsChildWindow = null;
var insertChildWindow = null;
var updateChildWindow = null;
var deleteChildWindow = null;

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
  mainWindow = new BrowserWindow({width: 800, height: 600});

  // and load the main.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/windows/main/main.html');

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

/*
 * Windows handlers and inter-process communication (IPC) bindings
 */

// Insert plant
function createInsertPlantWindow() {
  insertPlantWindow = new BrowserWindow({width: 640, height: 480, show: false});
  insertPlantWindow.loadUrl('file://' + __dirname + '/windows/insertPlant/insertPlant.html');
  insertPlantWindow.on('closed',function() {
    insertPlantWindow = null;
  });
}
ipc.on('toggle-insertPlant-view', function() {
  if(!insertPlantWindow) {
    createInsertPlantWindow();
  }
  return (!insertPlantWindow.isClosed() && insertPlantWindow.isVisible()) ? 
    insertPlantWindow.hide() : insertPlantWindow.show();
});

// Insert child
function createInsertChildWindow() {
  insertChildWindow = new BrowserWindow({width: 640, height: 480, show: false});
  insertChildWindow.loadUrl('file://' + __dirname + '/windows/insertChild/insertChild.html');
  insertChildWindow.on('closed',function() {
    insertChildWindow = null;
  });
}
ipc.on('toggle-insertChild-view', function() {
  if(!insertChildWindow) {
    createInsertChildWindow();
  }
  return (!insertChildWindow.isClosed() && insertChildWindow.isVisible()) ?
    insertChildWindow.hide() : insertChildWindow.show();
});

// Update plant
function createUpdatePlantWindow() {
  updatePlantWindow = new BrowserWindow({width: 640, height: 480, show: false});
  updatePlantWindow.loadUrl('file://' + __dirname + '/windows/updatePlant/updatePlant.html');
  updatePlantWindow.on('closed',function() {
    updatePlantWindow = null;
  });
}
ipc.on('toggle-updatePlant-view', function() {
  if(!updatePlantWindow) {
    createUpdatePlantWindow();
  }
  return (!updatePlantWindow.isClosed() && updatePlantWindow.isVisible()) ?
    updatePlantWindow.hide() : updatePlantWindow.show();
});

// Update child
function createUpdateChildWindow() {
  updateChildWindow = new BrowserWindow({width: 640, height: 480, show: false});
  updateChildWindow.loadUrl('file://' + __dirname + '/windows/updateChild/updateChild.html');
  updateChildWindow.on('closed',function() {
    updateChildWindow = null;
  });
}
ipc.on('toggle-updateChild-view', function() {
  if(!updateChildWindow) {
    createUpdateChildWindow();
  }
  return (!updateChildWindow.isClosed() && updateChildWindow.isVisible()) ?
    updateChildWindow.hide() : updateChildWindow.show();
});

// Delete plant
function createDeletePlantWindow() {
  deletePlantWindow = new BrowserWindow({width: 640, height: 480, show: false});
  deletePlantWindow.loadUrl('file://' + __dirname + '/windows/deletePlant/deletePlant.html');
  deletePlantWindow.on('closed',function() {
    deletePlantWindow = null;
  });
}
ipc.on('toggle-deletePlant-view', function() {
  if(!deletePlantWindow) {
    createDeletePlantWindow();
  }
  return (!deletePlantWindow.isClosed() && deletePlantWindow.isVisible()) ?
    deletePlantWindow.hide() : deletePlantWindow.show();
});

// Delete child
function createDeleteChildWindow() {
  deleteChildWindow = new BrowserWindow({width: 640, height: 480, show: false});
  deleteChildWindow.loadUrl('file://' + __dirname + '/windows/deleteChild/deleteChild.html');
  deleteChildWindow.on('closed',function() {
    deleteChildWindow = null;
  });
}
ipc.on('toggle-deleteChild-view', function() {
  if(!deleteChildWindow) {
    createDeleteChildWindow();
  }
  return (!deleteChildWindow.isClosed() && deleteChildWindow.isVisible()) ?
    deleteChildWindow.hide() : deleteChildWindow.show();
});