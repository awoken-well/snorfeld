import chokidar  from 'chokidar'
import fragments from './fragments.mjs'

let listener = null

/**
 * Add a listener of catalogue updates
 * @param {*} l new listener
 */
function setListener(l) {
  listener = l
}

// initialise catalogue
let catalogue = {}

let basePath = '/Users/olafjanssen/Dropbox/Personal/Apps/snorfeld/test'

// watch the configured project folder
// TODO: implement folder from UI/config file
const watcher = chokidar.watch([`${basePath}/**/*.md`,`${basePath}/**/*.txt`], {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
})

/**
 * Create a fragment into the catalogue
 * @param {*} path the file path of the fragment
 */
function createFragment(path) {
    console.log('- adding: ', path)
    const fragment =  fragments.readFragment(path)
    catalogue[path] = fragment
    listener.onCreate(fragment)
}

/**
 * Update a fragment into the catalogue
 * @param {*} path the file path of the fragment
 */
 function updateFragment(path) {
  console.log('- updating: ', path)
  const fragment =  fragments.readFragment(path)
  catalogue[path] = fragment
  listener.onUpdate(fragment)
}


/**
 * Delete a fragment from the catalogue
 * @param {*} path the file path of the fragment that is removed
 */
function deleteFragment(path) {
    console.log('- deleting: ', path)
    delete catalogue[path]
    listener.onDelete(path)
}

// Add event listeners.
watcher
  .on('add', path => createFragment(path))
  .on('change', path => updateFragment(path))
  .on('unlink', path => deleteFragment(path))

// More possible events.
watcher
  .on('error', error => console.log(`Watcher error: ${error}`))
  .on('ready', () => console.log('Initial scan complete. Ready for changes'))

export default {
  catalogue,
  setListener
}