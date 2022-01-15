import {
    derived,
    writable,
    get
} from 'svelte/store'
import {
    files,
    renameFile,
    deleteFile
} from './FileStore.js'


export function Fragment(fragment) {
	const { subscribe, set, update } = writable(fragment)

	return {
		subscribe,
        set,
        rename: (filename) => {
            let slash = fragment.path.lastIndexOf('/')
            let newPath = fragment.path.slice(0, slash + 1) + filename
            renameFile(fragment.path, newPath)
        }, 
        delete: () => {
            deleteFile(fragment.path)
        }
	}
}

let _fragments = {}

export const fragments = derived(files, $files => {
    let __fragments = {}
    Object.values($files).forEach(f => {
        if (!_fragments[f.path] || get(_fragments[f.path]).lastModified != f.lastModified) {
            let parsedPath = window.api.parsePath(f.path)
            let fragment = {
                id: f.path,
                slug: parsedPath.name,
                filename: parsedPath.base,
                path: f.path,
                raw: f.raw,
                lastModified: f.lastModified,
                parsed: f.parsed
            }
            if (!_fragments[f.path]){
                _fragments[f.path] = Fragment(fragment)
            } else {
                _fragments[f.path].set(fragment)
            }
        } 
        __fragments[f.path] = _fragments[f.path]
    })
    _fragments = __fragments
    return _fragments
})

export const selectedFragment = writable(null)
