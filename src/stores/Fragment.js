import {
    get,
    writable,
} from 'svelte/store'

export function Fragment(fragment) {
	const store = writable(fragment)

	return {
		subscribe : store.subscribe,
        set: store.set,
        update: (fn) => {
            store.update(fn)
            window.api.send('file:writedata', {
                path: get(store).id,
                data: get(store).parsed
            })
        },
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
