<script>
import CodeMirror from './components/codemirror/CodeMirror.svelte'
import './components/codemirror/customstyle.css'

export let document = null

let scrollState = {}
let scrollElement
let existingDocument
let editor

$: {
    console.log('newdoc: ', document)
    if (existingDocument) {
        // update the scroll state in the editor
        scrollState[existingDocument.id] = scrollElement.scrollTop
    }
    if (document){
        editor.swapDoc(document)
        scrollElement.scrollTop = scrollState[document.id]
        existingDocument = document
    } 
}
</script>

<div bind:this={scrollElement} class="mirror">
    <CodeMirror bind:editor options={{ mode: 'yaml-frontmatter',
        lineWrapping: true,
        inputStyle: 'contenteditable',
        styleSelectedText: true,
        viewportMargin: Infinity}} value=''> </CodeMirror>
</div>

<style>
.mirror {
    overflow-y: scroll;
    width: 100%;
    height: 100%;
    position: relative;
}
</style>