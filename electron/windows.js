/**
 * Window manager
 */
const path = require("path")

const {
    BrowserWindow,
    ipcMain
} = require("electron");

const windows = new Set();

const createWindow = async (projectPath) => {
    let newWindow = new BrowserWindow({
        show: false,
        // frame: false,
        // titleBarStyle: 'hidden',
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false, // is default value after Electron v5
            contextIsolation: true, // protect against prototype pollution
            enableRemoteModule: false, // turn off remote
            preload: path.join(__dirname, "preload.js") // use a preload script
        }
    })

    const watcher = require("./watcher.js")(ipcMain, newWindow)

    newWindow.loadFile(path.join(__dirname, "../public/index.html"))
    // newWindow.webContents.openDevTools()

    newWindow.webContents.on('did-finish-load', () => {
        if (!newWindow) {
            throw new Error('"newWindow" is not defined');
        }
        if (process.env.START_MINIMIZED) {
            newWindow.minimize();
        } else {
            newWindow.show();
            newWindow.focus();
        }

        // open project if needed
        if (projectPath) {
            console.log('opening last folder: ', projectPath);
            newWindow.webContents.send('project:opened', {
                path: projectPath
            })
        }
    })

    newWindow.on('closed', () => {
        watcher.stop()
        windows.delete(newWindow)
        newWindow = null;
    })

    newWindow.on('focus', () => {
        // ensure the application menu
        require('./menu.js')(ipcMain, manager, store)
    });
    windows.add(newWindow);

    return newWindow;
}

let store

let manager = {
    createWindow,
    windows
}

module.exports = (_store) => {
    store = _store

    return manager
}