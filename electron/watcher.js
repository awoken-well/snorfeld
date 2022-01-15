const chokidar = require("chokidar")
const matter = require("gray-matter")
const fs = require("fs")
const {
    rename
} = require("original-fs")
const path = require('path')

module.exports = function Watcher(ipcMain, win) {

    ipcMain.on('watch:start', (event, args) => {
        if (win.webContents.id != event.sender.id) return
        console.log('Started watching: ', args.path)
        console.log(win.webContents.id, event.sender.id)

        const path = args.path;
        watch(path);
    })

    ipcMain.on('file:write', (event, args) => {
        if (win.webContents.id != event.sender.id) return
        console.log('Saving', args.path)
        save(args.path, args.raw)
    })

    ipcMain.on('file:writedata', (event, args) => {
        if (win.webContents.id != event.sender.id) return
        console.log('New from data', args.path)
        const raw = matter.stringify(args.data.content, args.data.data)
        save(args.path, raw)
    })

    ipcMain.on('file:rename', (event, args) => {
        if (win.webContents.id != event.sender.id) return
        console.log('Rename ', args.path, ' to ', args.newPath)
        rename(args.path, args.newPath)
    })

    ipcMain.on('file:delete', (event, args) => {
        if (win.webContents.id != event.sender.id) return
        console.log('Delete ', args.path)
        unlink(args.path)
    })

    let watcher

    async function watch(path) {
        // stop watching old folder if watcher already exists
        if (watcher) {
            console.log("stop old watcher")
            await watcher.close()
        }

        watcher = chokidar.watch([`${path}/**/*.md`, `${path}/**/*.txt`], {
            ignored: /[\/\\]\./,
            persistent: true
        });

        function onWatcherReady() {
            console.info('From here can you check for real changes, the initial scan has been completed.');
        }

        // Add event listeners.
        watcher
            .on('add', path => add(path))
            .on('change', path => update(path))
            .on('unlink', path => remove(path))

        // More possible events.
        watcher
            .on('error', error => console.log(`Watcher error: ${error}`))
            .on('ready', () => console.log('Initial scan complete. Ready for changes'))
    }

    function getFile(_path) {
        let raw = fs.readFileSync(_path).toLocaleString()
        let stats = fs.statSync(_path)

        return {
            id: _path,
            path: path.parse(_path),
            lastModified: stats.mtimeMs,
            raw: raw,
            parsed: matter(raw, {
                excerpt: false,
                sections: false
            })
        }
    }

    function add(path) {
        console.log('watch added:', path)
        win.webContents.send('watch:added', getFile(path));
    }

    function update(path) {
        console.log('watch updated:', path)
        win.webContents.send('watch:updated', getFile(path));
    }

    function remove(path) {
        console.log('watch removed:', path)
        win.webContents.send('watch:removed', {
            path: path,
        });
    }

    function save(path, raw) {
        fs.writeFileSync(path, raw)
    }

    function rename(path, newPath) {
        fs.renameSync(path, newPath)
    }

    function unlink(path) {
        fs.unlinkSync(path)
    }

    return {
        stop: () => {
            if (watcher) {
                console.log("stop old watcher")
                watcher.close()
            }
        }
    }
}