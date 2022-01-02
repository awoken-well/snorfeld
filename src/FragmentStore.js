import {
    derived,
    readable,
    writable,
    get
} from 'svelte/store'
import {
    files
} from './FileStore.js'

let _fragments = {}

export const fragments = derived(files, $files => {
    let __fragments = {}
    Object.values($files).forEach(f => {
        if (!_fragments[f.path] || get(_fragments[f.path]).lastModified != f.lastModified) {
            let fragment = {
                id: f.path,
                slug: f.path.split("/").pop().split('.')[0],
                path: f.path,
                raw: f.raw,
                lastModified: f.lastModified,
                parsed: f.parsed
            }
            if (!_fragments[f.path]){
                __fragments[f.path] = writable(fragment)
            } else {
                __fragments[f.path].set(fragment)
            }
        } else {
            __fragments[f.path] = _fragments[f.path]
        }
    })
    _fragments = __fragments
    return _fragments
})

export const selectedFragment = writable(null)