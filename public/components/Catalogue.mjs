const socket = io()

let catalogue = {}

socket.on('connect', () => {
    console.log('connected')
    socket.emit('fragment:list')
})

socket.on('fragment:created', (f) => {
    console.log('fragment:created', f)
    catalogue[f.path] = f

    document.body.dispatchEvent(
        new CustomEvent('fragment:created', {detail: f})
    )
})

socket.on('fragment:updated', (f) => {
    console.log('fragment:updated', f)
    catalogue[f.path] = f

    document.body.dispatchEvent(
        new CustomEvent('fragment:updated', {detail: f})
    )
})

socket.on('fragment:deleted', (p) => {
    console.log('fragment:deleted', p)
    delete catalogue[p]

    document.body.dispatchEvent(
        new CustomEvent('fragment:deleted', {detail: p})
    )
})

socket.on('fragment:listed', (c) => {
    console.log('fragment:listed', c)
    catalogue = c

    document.body.dispatchEvent(
        new CustomEvent('fragment:listed', {detail: catalogue})
    )
})

function getOrderedList(){
    let c = Object.values(catalogue)
    c.sort((a,b) => ('' + a.path).localeCompare(b.path))
    return c
}

function updateRawFragment(path, raw) {
    catalogue[path].raw = raw
    socket.emit('fragment:update', catalogue[path])
}

export default {
    getCatalogue: ()=> catalogue,
    getOrderedList,
    updateRawFragment
}