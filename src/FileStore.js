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
        _files[data.path] = data
        files.set(_files)
    })
    
    window.api.receive('watch:removed', (data) => {
        delete _files[data.path]
        files.set(_files)
    })
    
    window.api.receive('watch:updated', (data) => {
        _files[data.path] = data
        files.set(_files)
    })

    export const updateRawText = (path, raw) => {
        window.api.send('file:write', {
            path: path,
            raw: raw
        })
    }

    export const renameFile = (path, newPath) => {
        window.api.send('file:rename', {
            path: path,
            newPath: newPath
        })
    }
