import {
    derived,
    get
} from 'svelte/store'
import {
    selectedFragment
} from './FragmentStore.js'
import { updateRawText } from './FileStore.js'


import CodeMirror from 'codemirror'

const MODE = {
    name: 'yaml-frontmatter-snorfeld',
    highlightFormatting: true
}
let _documents = {}

// update the current document based on the selection and create a new document if needed
export const currentDocument = derived(selectedFragment, $selectedFragment => {
    if (!$selectedFragment) return null

    let fragment = get($selectedFragment)
    if (!_documents[fragment.id]) {
        let doc = CodeMirror.Doc(fragment.raw, MODE)
        doc.id = fragment.id
        _documents[fragment.id] = doc

        // detect changes from the editor
        let saveGeneration = null
        let saveTimerHandle = null
        doc.on('change', (changes) => {
            if (saveTimerHandle) {
                window.clearTimeout(saveTimerHandle)
            }
            saveTimerHandle = window.setTimeout(() => {
                saveGeneration = doc.changeGeneration()
                console.log('saving')
                updateRawText(doc.id, doc.getValue())
            }, 3000)
        })

        // subscribe to outside changes
        $selectedFragment.subscribe(f=>{
            if (!doc.isClean(saveGeneration) || f.raw == doc.getValue()) {
                 console.log('ignoring update from server')
                 return
            }
            let cursor = doc.getCursor()
            doc.setValue(f.raw)
            doc.setCursor(cursor)
        })
        
    }
    return _documents[fragment.id]
})
