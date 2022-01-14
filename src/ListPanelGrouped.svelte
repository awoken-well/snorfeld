<script>
import {get} from 'svelte/store'
import {fragments, selectedFragment} from './FragmentStore.js'

import FragmentData from './FragmentData.js'

function selectFragment(fragment) {
	selectedFragment.set($fragments[fragment.id])
}

let groupedFragments = []
$: groupedFragments = FragmentData($fragments).groupByDataKey('type')

let fragmentList = []
$: fragmentList = Object.values($fragments).sort((a,b) => ('' + get(a).path).localeCompare(get(b).path))

let renameMode = {mode: false, value: ''}

function onKeyUp(event) {
	if (event.keyCode === 13) {
    	if (!renameMode.mode) {
			event.preventDefault()
			renameMode.mode = true
			window.requestAnimationFrame(()=>{
				event.target.querySelector('input').focus()
			})
		} else {
			event.preventDefault()
			renameMode.mode = false
			doRename()
		}
	} else if (event.keyCode === 27 && renameMode.mode) {
		renameMode.mode = false
	}
}

function onUnfocus(event) {
	if (renameMode.mode) {
		renameMode.mode = false
		doRename()
	}
}

function onInput(event) {
	renameMode.value = event.target.value
}

function doRename(){
	get(selectedFragment).rename(renameMode.value)
}

</script>

<div class="container">
{#each groupedFragments as group (group.key)}
<section>
	<header><gg-icon class="gg-chevron-down"></gg-icon> {group.key}</header>
<ul>
	{#each group.values as fragment (fragment.id)}
		<li on:click={selectFragment(fragment)} 
			on:keyup={onKeyUp} 
			tabindex="0" 
			class:selected={$selectedFragment && fragment.id == get($selectedFragment).id} 
			class:editable="{$selectedFragment && fragment.id == get($selectedFragment).id && renameMode.mode}" >
				<gg-icon class="gg-file-document"></gg-icon><span>{fragment.slug}</span>
				<input 
					on:blur={onUnfocus}
					on:input={onInput}
					type="text" 
					value="{fragment.filename}"/>
			</li>
	{/each}
</ul>
</section>
{/each}
</div>


<style>
	.container {
		overflow-y: scroll;
		position: absolute;
		overflow-x: hidden;
		width: 100%;
		height: 100%;
		font-size: 0.8em;
	}

	header {
		--ggs: 0.6;		
		user-select: none;
    	line-height: 1.5em;
    	padding: 0 0.25em;
		background-color: var(--header-back-color);
		font-weight: bold;
	}

	li gg-icon {
		--ggs: 0.6;
		vertical-align: middle;
		margin-right: 0.5em;
	}

	ul {
		list-style: none;
		padding: 0.5em 0.5em 1em 0.5em; 
		box-sizing: border-box;
		margin: 0;
	}

	li {
		position: relative;
		white-space: nowrap;
		user-select: none;
    	overflow: hidden;
		cursor: pointer;
		outline: none;
		line-height: 1.5em;
	}

	li:hover {
		background: var(--ui-selected-back-color-unfocus);
 	   	color: var(--ui-selected-front-color);
	}

	/* rgb(64,123,100) */
	li.selected {
		background: var(--ui-selected-back-color-unfocus);
 	   	color: var(--ui-selected-front-color);
	}

	li.selected:focus {
		background: var(--ui-selected-back-color);
	}

	li input {
		position: absolute;
		height: 1.5em;
		outline: none;
		display: none;
		width: 100%;
		left: 0;
		top: 0;
	}

	li.editable input {
		display: block;
	}

	gg-icon {
		display: inline-block;
		vertical-align: bottom;
	}
</style>
