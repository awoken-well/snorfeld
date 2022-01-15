import {
    writable,
} from 'svelte/store'

export function Fragment(fragment) {
	const { subscribe, set, update } = writable(fragment)

	return {
		subscribe,
        set,
        rename: (filename) => {
            let folder = window.api.parsePath(expath).dir
            let newPath = window.api.joinPath([folder, filename])
            window.api.send('file:rename', {
                path: fragment.path,
                newPath: newPath
            })        
        }, 
        delete: () => {
            window.api.send('file:delete', {
                path: fragment.path
            })
        
        }
	}
}
