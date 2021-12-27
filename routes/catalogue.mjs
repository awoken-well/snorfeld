import express from 'express'
const router = express.Router()

import catalogue from '../components/catalogue.mjs'

/* GET full catalogue */
router.get('/', function(req, res, next) {
    res.send(catalogue)
})

export default router
