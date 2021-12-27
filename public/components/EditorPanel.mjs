import Documents from './Documents.mjs'

class EditorPanel extends HTMLElement {

    constructor() {
        super()
        this.saveTimerHandle = null
        this.saveGeneration = null
    }

    // connect component
    connectedCallback() {
        
        let header = document.createElement('header')
        header.innerHTML = `<span class="title"></span>`
        this.appendChild(header)
        let div = document.createElement('div')
        this.appendChild(div)
        
        let editor = CodeMirror(div, {
            mode: Documents.MODE,
            lineWrapping: true,
            inputStyle: 'contenteditable',
            styleSelectedText: true,
            viewportMargin: Infinity
          })

        // listen to events
        document.body.addEventListener('fragment:selected', async (e)=>{
            let f = e.detail
            editor.swapDoc(Documents.documents[f.path])

            this.setAttribute('fragment',f.path)
            this.querySelector('.title').innerHTML = f.meta.filename            
        })

        document.body.addEventListener('fragment:updated', (e)=>{
            let f = e.detail
            let scrollTop = div.scrollTop
            let cursor = editor.getCursor()

            if (f.path == this.getAttribute('fragment')){
                if (!editor.isClean(this.saveGeneration) || f.raw == editor.getValue()) {
                    console.log('ignoring update from server')
                    return
                }
                Documents.documents[f.path].setValue(f.raw)
                editor.setCursor(cursor)
                div.scrollTop = scrollTop
            } 
        })
  
        document.body.addEventListener('fragment:deleted', (e)=>{
            let f = e.detail

            if (f.path == this.getAttribute('fragment')){
                editor.swapDoc(CodeMirror.Doc('', Documents.MODE))
            }
        })
    }
    
}
  
// register component
customElements.define( 'editor-panel', EditorPanel );

export default EditorPanel
