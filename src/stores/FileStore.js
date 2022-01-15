import {
    writable
} from 'svelte/store'

let _files = {}

export const files = writable({})

function resetProject() {
    _files = {}
    files.set(_files)
}

export function openProject(path) {
    resetProject()
    console.log("opening project at:", path)
    document.title = path
    window.api.send('watch:start', {
        path: path
    })
}

window.api.receive('project:opened', (data) => {
    openProject(data.path)
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

export const createWithData = (path, data) => {
    window.api.send('file:writedata', {
        path: path,
        data: data
    })
}
