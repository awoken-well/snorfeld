import {
    derived,
    writable,
    get
} from 'svelte/store'
import {
    files,
} from './FileStore.js'
import {Fragment} from './Fragment.js'

let _fragments = {}

export const fragments = derived(files, $files => {
    let __fragments = {}
    Object.values($files).forEach(f => {
        if (!_fragments[f.id] || get(_fragments[f.id]).lastModified != f.lastModified) {
            if (!_fragments[f.id]){
                _fragments[f.id] = Fragment(f)
            } else {
                _fragments[f.id].set(f)
            }
        } 
        __fragments[f.id] = _fragments[f.id]
    })
    _fragments = __fragments
    return _fragments
})

export const selectedFragment = writable(null)
