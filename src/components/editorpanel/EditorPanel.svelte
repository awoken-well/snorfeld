<script>
import CodeMirror from '../codemirror/CodeMirror.svelte'
import '../codemirror/customstyle.css'
import {get} from 'svelte/store'
import {fragments} from '../../stores/FragmentStore'

export let document = null

let scrollState = {}
let scrollElement
let existingDocument
let editor

$: {
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

async function addHeadline(){
    let fragment = $fragments[document.id]
    let raw = get(fragment).parsed.content
    let headline = await window.api.headline(raw)
    
    console.log(headline)
    fragment.update((f)=>{
        f.parsed.data['headline'] = headline
        return f
    })
}

async function addSummary(){
    let fragment = $fragments[document.id]
    let raw = get(fragment).parsed.content
    let summary = await window.api.summarize(raw)
    
    fragment.update((f)=>{
        f.parsed.data['summary'] = summary
        return f
    })
}

</script>

<div>
    <header>editor <menu><gg-icon on:click={addSummary} class="gg-bot">summary</gg-icon><gg-icon on:click={addHeadline} class="gg-bot">headline</gg-icon></menu></header>
    <div bind:this={scrollElement} class="mirror" class:hide={!document}>
        <CodeMirror bind:editor options={{ mode: 'yaml-frontmatter',
            lineWrapping: true,
            inputStyle: 'contenteditable',
            styleSelectedText: true,
            viewportMargin: Infinity}} value=''> </CodeMirror>
    </div>
</div>

<style>

header {
		--ggs: 0.6;		
		user-select: none;
    	line-height: 1.5em;
    	padding: 0 0.25em;
		background-color: var(--header-back-color);
		font-weight: bold;
		position: relative;
	}

	menu {
		position: absolute;
		top: 0;
		right: 0;
		height: 100%;
		padding: 0;
		margin: 0;
		display: none;
		justify-content: end;
	}

	header:hover menu {
		display: flex;
	}
    
    .hide {
        visibility: hidden;
    }
.mirror {
    overflow-y: auto;
    width: 100%;
    height: 100%;
    position: relative;
}
</style>