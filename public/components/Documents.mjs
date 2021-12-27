import Catalogue from './Catalogue.mjs'

const MODE = {name: 'yaml-frontmatter', highlightFormatting: true}
let documents = {}

// listen to events
document.body.addEventListener('fragment:selected', (e) => {
    console.log("SELECTED?")
    let f = e.detail

    if (!documents[f.path]) {
        let saveGeneration = null
        let saveTimerHandle = null

        let doc = CodeMirror.Doc(f.raw, MODE)
        documents[f.path] = doc

        doc.on('changes', (changes) => {
            console.log('changes:', changes)
            console.log('gen:', doc.changeGeneration())
        
            if (saveTimerHandle) {
                window.clearTimeout(saveTimerHandle)
            }
            saveTimerHandle = window.setTimeout(() => {
                saveGeneration = doc.changeGeneration()
                console.log('saving')
                Catalogue.updateRawFragment(this.getAttribute('fragment'), doc.getValue())
            }, 3000)
        })
    }
    console.log(documents)
})

document.body.addEventListener('fragment:updated', (e) => {
    let f = e.detail
    
    // safely update if the document is not currently in an editor, otherwise the editor needs to do it smartly
    if (documents[f.path] && !documents[f.path].editor) {
        documents[f.path].setValue(f.raw)
    }
})

document.body.addEventListener('fragment:deleted', (e) => {
    let f = e.detail

    if (documents[f.path]) {
        delete documents[f.path]
    }
})


export default {
    documents,
    MODE
}
