import { readable } from 'svelte/store'

let set = null
let _files = {}

export const files = readable({},(_set) => {
        set = _set

        // first subscriber (DO THIS VIA MENU AND STORED DEFAULT PROJECT)
        // window.api.send('watch:start', {
        //     path: '/Users/olafjanssen/Downloads/nanowrimo2021'
        // })

        window.api.send('project:openlast')

        return () => {
            // no more subscribers
            console.log("stop watching")
        }
    })
    
    window.api.receive('project:opened', (data) => {
        console.log("opening project at:", data.path)
        document.title = data.path
        window.api.send('watch:start', {
            path: data.path
        })
    })


    window.api.receive('watch:added', (data) => {
        console.log('file add received')
        _files[data.path] = data
        set(_files)
    })
    
    window.api.receive('watch:removed', (data) => {
        console.log('file remove received')
        delete _files[data.path]
        set(_files)
    })
    
    window.api.receive('watch:updated', (data) => {
        console.log('file update received')
        _files[data.path] = data
        set(_files)
    })

    export const updateRawText = (path, raw) => {
        window.api.send('file:write', {
            path: path,
            raw: raw
        })
    }