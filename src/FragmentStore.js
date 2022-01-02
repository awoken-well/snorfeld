import {
    derived,
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
        console.log('updating fragment:', f.path)
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
                console.log('create writable')
                _fragments[f.path] = writable(fragment)
            } else {
                console.log('update writable', __fragments[f.path])
                _fragments[f.path].set(fragment)
            }
        } 
        __fragments[f.path] = _fragments[f.path]
    })
    _fragments = __fragments
    return _fragments
})

export const selectedFragment = writable(null)