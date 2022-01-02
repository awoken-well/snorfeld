const chokidar = require("chokidar");
const matter = require("gray-matter");
const fs = require("fs");

let ipcMain = null;
let win = null;

let watcher

async function watch(path){
    // stop watching old folder if watcher already exists
    if (watcher) {
        await watcher.close()
    }

    watcher = chokidar.watch([`${path}/**/*.md`,`${path}/**/*.txt`], {
        ignored: /[\/\\]\./,
        persistent: true
    });
 
    function onWatcherReady(){
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

function getFile(path) {
    let raw = fs.readFileSync(path).toLocaleString()
    let stats = fs.statSync(path)
    return {
          path: path,
          lastModified: stats.mtimeMs,
          raw: raw,
          parsed: matter(raw, {excerpt:false, sections:false})
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
    console.log('saving file at ', path)
    fs.writeFileSync(path, raw)
}

module.exports = function Watcher(_ipcMain, _win) {
     ipcMain = _ipcMain,
     win = _win

     ipcMain.on('watch:start', (event, args) => {
          console.log('Started watching: ', args.path)
          const path = args.path;
          watch(path);
      });

      ipcMain.on('file:write', (event, args) => {
        console.log('Saving', args.path)
        save(args.path, args.raw)
    });

}