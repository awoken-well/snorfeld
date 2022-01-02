import { writable } from 'svelte/store'

let _files = {}

export const files = writable({})
    
    function resetProject(){
        _files = {}
        files.set(_files)
    }

    window.api.receive('project:opened', (data) => {
        resetProject()
        console.log("opening project at:", data.path)
        document.title = data.path
        window.api.send('watch:start', {
            path: data.path
        })
    })

    window.api.receive('project:closed', () => {
        resetProject()
    })


    window.api.receive('watch:added', (data) => {
        console.log('file add received')
        _files[data.path] = data
        files.set(_files)
    })
    
    window.api.receive('watch:removed', (data) => {
        console.log('file remove received')
        delete _files[data.path]
        files.set(_files)
    })
    
    window.api.receive('watch:updated', (data) => {
        console.log('file update received')
        _files[data.path] = data
        files.set(_files)
        console.log('done setting')
    })

    export const updateRawText = (path, raw) => {
        window.api.send('file:write', {
            path: path,
            raw: raw
        })
    }