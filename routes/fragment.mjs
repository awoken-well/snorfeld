import express from 'express'
import fragments from '../components/fragments.mjs'

const router = express.Router()

/* GET a single fragment */
router.get('/', function(req, res, next) {
    const path = req.query.path
    const fragment = fragments.readFragment(path)
    res.send(fragment)
})

/* POST a single fragment */
router.post('/', function(req, res, next) {
    const path = req.query.path
    const rawContent = req.body.path

    fragments.writeFragment(path,rawContent)
    res.sendStatus('OK')
})

/* DELETE a single fragment */
router.delete('/', function(req, res, next) {
    const path = req.query.path

    fragments.removeFragment(path)
    res.sendStatus('OK')
})

export default router
