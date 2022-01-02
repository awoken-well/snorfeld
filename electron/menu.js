const {
    app,
    Menu,
    dialog
} = require('electron')

module.exports = (ipcMain, mainWindow, store) => {
    const template = [{
            label: 'File',
            submenu: [{
                label: 'Open Folder',
                click: async () => {
                    console.log('clicked!')
                    const result = await dialog.showOpenDialog(mainWindow, {
                        properties: ['openDirectory']
                    })
                    if (!result.canceled) {
                        let path = result.filePaths[0]

                        store.set('lastProjectFolder', path);

                        mainWindow.webContents.send('project:opened', {
                            path: path
                        })
                    }
                }
            }]
        },
        {
            label: 'Edit',
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
            label: 'View',
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
        template[1].submenu.push({
            type: 'separator'
        }, {
            label: 'Speech',
            submenu: [{
                    role: 'startspeaking'
                },
                {
                    role: 'stopspeaking'
                }
            ]
        })
        // Window menu.
        template[3].submenu = [{
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