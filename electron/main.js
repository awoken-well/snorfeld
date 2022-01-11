const {
    app, ipcMain
} = require("electron");

const settings = require('./store.js')

const windowManager = require('./windows.js')(settings)

app.on("ready", () => {
    // open last project
    ipcMain.on('project:openlast', (event, args) => {
        const projectPath = settings.getLastProject()
        if (projectPath) {
            console.log('opening last folder: ', projectPath);
            event.sender.send('project:opened', {
                path: projectPath
            })
        }
    })

    const projectPath = settings.getLastProject()
    console.log(settings.getProjectHistory())
    windowManager.createWindow(projectPath)
})

app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform != 'darwin') {
        app.quit();
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (windows.size === 0) windowManager.createWindow();
})