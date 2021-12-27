/**
 * Entry point for Snorfeld back-end
 */

import express from 'express'
const port = 3000

import http from 'http'
import bodyParser from 'body-parser'

const app = express()
const server = http.createServer(app);

import SocketServer from './components/socket.mjs'
SocketServer(server)

// set up routes
import catalogueRouter from './routes/catalogue.mjs'
import fragmentRouter from './routes/fragment.mjs'

app.use('/api/catalogue', catalogueRouter)
app.use('/api/fragment', fragmentRouter)
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.use(express.static('public'))

server.listen(port, () => {
  console.log(`Snorfeld back-end listening at http://localhost:${port}`)
})
