const {app, BrowserWindow} = require('electron')
    const url = require("url");
    const path = require("path");

    let mainWindow

    function createWindow () {
      mainWindow = new BrowserWindow({
        width: 1280,
        height: 1000,
        webPreferences: {
          nodeIntegration: true
        },
        autoHideMenuBar: true
      })

      // mainWindow.loadURL(
      //   url.format({
      //     pathname: path.join(__dirname, `/dist/adaptive-typing/index.html`),
      //     protocol: "file:",
      //     slashes: true
      //   })
      // );
      mainWindow.loadURL('http://localhost:4200')
      // Open the DevTools.
      mainWindow.webContents.openDevTools()

      mainWindow.on('closed', function () {
        mainWindow = null
      })
    }

    app.on('ready', createWindow)

    app.on('window-all-closed', function () {
      if (process.platform !== 'darwin') app.quit()
    })

    app.on('activate', function () {
      if (mainWindow === null) createWindow()
    })