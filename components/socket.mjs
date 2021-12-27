import { Server } from 'socket.io'
import Catalogue from './catalogue.mjs'
import Fragments from './fragments.mjs'

let socket = null

function createFragment() {

}

function readFragment() {

}

function updateFragment(f) {
    Fragments.writeFragment(f.path, f.raw)
}

function deleteFragment() {

}

function listFragment() {
    if (!socket) return
    socket.emit('fragment:listed', Catalogue.catalogue)
}

Catalogue.setListener( {
    onCreate: (f) => {
        if (!socket) return
        socket.emit('fragment:created', f)
    },
    onUpdate: (f) => {
        if (!socket) return
        socket.emit('fragment:updated', f)
    },
    onDelete: (p) => {
        if (!socket) return
        socket.emit('fragment:deleted', p)
    }
})


export default function init(server){
    const io = new Server(server)
    
    io.on('connection', (s) => {
        socket = s
        console.log('Client connected')

        socket.on('fragment:create', createFragment)
        socket.on('fragment:read', readFragment)
        socket.on('fragment:update', updateFragment)
        socket.on('fragment:delete', deleteFragment)
        socket.on('fragment:list', listFragment)
    })
    
}

