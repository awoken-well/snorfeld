const {
    app,
    BrowserWindow,
    ipcMain
} = require("electron");
const path = require("path");

const Store = require('electron-store');


app.on("ready", () => {
    const mainWindow = new BrowserWindow({
        width: 600,
        height: 800,
        title: "Snorfeld",
        webPreferences: {
            nodeIntegration: false, // is default value after Electron v5
            contextIsolation: true, // protect against prototype pollution
            enableRemoteModule: false, // turn off remote
            preload: path.join(__dirname, "preload.js") // use a preload script
        }
    });

    const watcher = require("./watcher.js")(ipcMain, mainWindow);

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });

    mainWindow.loadFile(path.join(__dirname, "../public/index.html"));
    mainWindow.webContents.openDevTools();


    // application settings stored in the store
    const store = new Store()

    // add the application menu
    require('./menu.js')(ipcMain, mainWindow, store)

    // open last project
    ipcMain.on('project:openlast', (event, args) => {
        const projectPath = store.get('lastProjectFolder')
        if (projectPath) {
            console.log('opening last folder: ', projectPath);
            mainWindow.webContents.send('project:opened', {
                path: projectPath
            })
        }
    })

})

app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform != 'darwin') {
        app.quit();
    }
});