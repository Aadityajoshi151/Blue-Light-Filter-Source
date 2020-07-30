const { app, BrowserWindow, Menu, Tray, shell, ipcMain, globalShortcut,nativeImage} = require('electron')
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.


const electron = require("electron")
const path = require("path")
const fs = require('fs');
let win
let tray = null;
let settings
var enable = 1;

function createWindow () {

  // Create the browser window.
  win = new BrowserWindow({webPreferences: {
    nodeIntegration: true
}, width: 500, height: 500, transparent: true, frame: false , minimizable: false, fullscreen: true})
  win.setMenu(null);
  //win.webContents.openDevTools();
  win.setIgnoreMouseEvents(true);
  win.setAlwaysOnTop(true);
  // and load the index.html of the app.
  win.loadFile('index.html')


  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
    settings = null
  })
}

function SettingsWindow () {
  // Create the browser window.
  settings = new BrowserWindow({webPreferences: {
    nodeIntegration: true
}, width: 500, height: 500, minimizable: false, maximizable: false, resizable: false, frame: false, icon: "assets/icons/win/icon.ico"})
  settings.setMenu(null);
  // and load the index.html of the app.
  settings.loadFile('settings.html')
  //settings.webContents.openDevTools()

  // Emitted when the window is closed.
  settings.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    settings = null
  })
}
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    win.webContents.send("Second Instance");
    return;
    })
}

app.on('ready', () => {
  createWindow();
  win.setSkipTaskbar(true);
  globalShortcut.register('CommandOrControl+Q', () => {
    app.quit();
  })
  const iconPath = path.join(__dirname, 'icon.png');
  tray = new Tray(nativeImage.createFromPath(iconPath));
  //tray = new Tray("build/bulb.png")
  const contextMenu = Menu.buildFromTemplate([
    { label: "Disable",type: "checkbox" ,click: function(){
      if(enable==0)
      {
        win.show();
        win.setSkipTaskbar(true);
        enable = 1;
      }
      else if(enable == 1)
      {
        win.hide();
        enable = 0;
      }
    }},
    {type: "separator"},
    { label: "Settings", click: function(){
      SettingsWindow();
    }},
    { label: "About", click: function(){
      shell.openExternal('https://aadityajoshi151.github.io/Blue-Light-Filter/')
    }},
    {type: "separator"},
    { label: "Quit (Ctrl+Q)", click: function(){
      app.quit();
    } }
  ])
  tray.setToolTip('Blue Light Filter')
  tray.setContextMenu(contextMenu)
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

ipcMain.on('request-update-label-in-second-window', (event, arg) => {
  // Request to update the label in the renderer process of the second window
  // We'll send the same data that was sent to the main process
  // Note: you can obviously send the 
  win.webContents.send('action-update-label', arg);
});

ipcMain.on('opacityreceive', (event, arg) => {
  // Request to update the label in the renderer process of the second window
  // We'll send the same data that was sent to the main process
  // Note: you can obviously send the 
  win.webContents.send('opacitysend', arg);
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
ipcMain.on('Quit', (event, arg) => {
  settings.close();
})
ipcMain.on('restore', (event, arg) => {
  win.webContents.send('restore-defaults' ,arg);
})

