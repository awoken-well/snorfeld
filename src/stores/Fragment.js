import {
    writable,
} from 'svelte/store'

export function Fragment(fragment) {
	const { subscribe, set, update } = writable(fragment)

	return {
		subscribe,
        set,
        update,
        rename: (filename) => {
            let newPath = window.api.joinPath([fragment.path.dir, filename])
            window.api.send('file:rename', {
                path: fragment.id,
                newPath: newPath
            })        
        }, 
        delete: () => {
            window.api.send('file:delete', {
                path: fragment.id
            })
        
        }
	}
}
