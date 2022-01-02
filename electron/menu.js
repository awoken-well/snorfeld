const {
    app,
    Menu,
    dialog
} = require('electron')

module.exports = (ipcMain, windowManager, store) => {
    const template = [{
            label: '&File',
            submenu: [{
                    label: 'New Window',
                    click: async (menuItem, browserWindow, event) => {
                        windowManager.createWindow()
                    }
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Open Project',
                    click: async (menuItem, browserWindow, event) => {
                        const result = await dialog.showOpenDialog(browserWindow, {
                            properties: ['openDirectory']
                        })
                        if (!result.canceled) {
                            let path = result.filePaths[0]

                            store.set('lastProjectFolder', path)

                            browserWindow.webContents.send('project:opened', {
                                path: path
                            })
                        }
                    }
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Close Project',
                    click: async (menuItem, browserWindow, event) => {
                        browserWindow.webContents.send('project:closed')
                    }
                },
            ]
        },
        {
            label: '&Edit',
            submenu: [{
                    role: 'undo'
                },
                {
                    role: 'redo'
                },
                {
                    type: 'separator'
                },
                {
                    role: 'cut'
                },
                {
                    role: 'copy'
                },
                {
                    role: 'paste'
                },
                {
                    role: 'pasteandmatchstyle'
                },
                {
                    role: 'delete'
                },
                {
                    role: 'selectall'
                }
            ]
        },
        {
            label: '&View',
            submenu: [{
                    label: 'Reload',
                    accelerator: 'CmdOrCtrl+R',
                    click(item, focusedWindow) {
                        if (focusedWindow) focusedWindow.reload()
                    }
                },
                {
                    label: 'Toggle Developer Tools',
                    accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
                    click(item, focusedWindow) {
                        if (focusedWindow) focusedWindow.webContents.toggleDevTools()
                    }
                },
                {
                    type: 'separator'
                },
                {
                    role: 'resetzoom'
                },
                {
                    role: 'zoomin'
                },
                {
                    role: 'zoomout'
                },
                {
                    type: 'separator'
                },
                {
                    role: 'togglefullscreen'
                }
            ]
        },
        {
            role: 'window',
            submenu: [{
                    role: 'minimize'
                },
                {
                    role: 'close'
                }
            ]
        },
        {
            role: 'help',
            submenu: [{
                label: 'Learn More',
                click() {
                    require('electron').shell.openExternal('http://electron.atom.io')
                }
            }]
        }
    ]

    if (process.platform === 'darwin') {
        template.unshift({
            label: app.getName(),
            submenu: [{
                    role: 'about'
                },
                {
                    type: 'separator'
                },
                {
                    role: 'services',
                    submenu: []
                },
                {
                    type: 'separator'
                },
                {
                    role: 'hide'
                },
                {
                    role: 'hideothers'
                },
                {
                    role: 'unhide'
                },
                {
                    type: 'separator'
                },
                {
                    role: 'quit'
                }
            ]
        })
        // Edit menu.
        template[2].submenu.push({
            type: 'separator'
        }, {
            label: 'Speech',
            submenu: [{
                    role: 'toggleSpellChecker'
                },
                {
                    role: 'startspeaking'
                },
                {
                    role: 'stopspeaking'
                }
            ]
        })
        // Window menu.
        template[4].submenu = [{
                label: 'Close',
                accelerator: 'CmdOrCtrl+W',
                role: 'close'
            },
            {
                label: 'Minimize',
                accelerator: 'CmdOrCtrl+M',
                role: 'minimize'
            },
            {
                label: 'Zoom',
                role: 'zoom'
            },
            {
                type: 'separator'
            },
            {
                label: 'Bring All to Front',
                role: 'front'
            }
        ]
    }

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
}