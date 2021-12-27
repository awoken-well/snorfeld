import chokidar  from 'chokidar'
import fs from 'fs'
import matter from 'gray-matter'
import path from 'path'

/**
 * Read a fragment
 * @param {string} path the file path of the fragment
 */
function readFragment(uri) {
    const fragment =  matter.read(uri, { 
        excerpt: false,
        sections: false })
    
    fragment.raw = fragment.orig.toString()
    fragment.meta = {
        filename: path.parse(uri).name
    }

    return fragment
}

/**
 * Write a fragment
 * @param {string} path the file path of the fragment
 * @param {string} rawContent the full raw text to store
 */
function writeFragment(path, rawContent) {
    fs.writeFileSync(path, rawContent)
}

/**
 * Remove a fragment
 * 
 * @param {string} path the file path of the fragment
 */
function removeFragment(path) {
    fs.unlinkSync(path)
}

export default {
    readFragment,
    writeFragment,
    removeFragment
}