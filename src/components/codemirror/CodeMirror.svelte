<script>
    import { onMount } from 'svelte'
    import CodeMirror from 'codemirror/lib/codemirror.js'
    import 'codemirror/mode/markdown/markdown.js'
    import 'codemirror/addon/selection/mark-selection.js'
    import 'codemirror/addon/mode/overlay.js'
    import 'codemirror/mode/gfm/gfm.js'
    import 'codemirror/mode/yaml/yaml.js'
    import 'codemirror/mode/yaml-frontmatter/yaml-frontmatter.js'
    import 'codemirror/lib/codemirror.css'
    
    let classes = ''
    export let editor = null
    export let options = {}
    export let value
    export { classes as class }

    let element
    onMount(() => createEditor(options))
    
    $: if(element) { createEditor(options) }
    function createEditor(options) {
      if (!window) return
      if (!element) return
      if (editor) element.innerHTML = ''
      editor = CodeMirror(element, {...options, value})
      editor.on('change', () => {
        value = editor.getValue()
      })
    }

    $: if (editor) {
      const pos = editor.getCursor()
      editor.setValue(value)
      editor.setCursor(pos)
    }

    $: if (editor) {
      Object.entries(options).forEach(([key, value]) => {
        editor.setOption(key, value)
      })
    }
    import './customstyle.css'
  </script>
  
  <div bind:this={element} class={classes}/>
