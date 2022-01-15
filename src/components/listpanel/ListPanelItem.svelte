<script>
import {get} from 'svelte/store'
import {fragments, selectedFragment} from '../../stores/FragmentStore.js'

function selectFragment(fragment) {
	selectedFragment.set($fragments[fragment.id])
}

export let fragment

let renameMode = {mode: false, value: ''}

let selected = false
$: selected = $selectedFragment && fragment.id == get($selectedFragment).id

let editable = false
$: editable = selected && renameMode.mode


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

function trashFragment() {
	get(selectedFragment).delete()
}

</script>

<li on:click={selectFragment(fragment)} 
	on:keyup={onKeyUp} 
	tabindex="0" class:selected class:editable >
		<gg-icon class="gg-file-document"></gg-icon><span>{fragment.path.name}</span>
		<menu><gg-icon on:click={trashFragment} class="gg-trash"></gg-icon></menu>
		<input 
			on:blur={onUnfocus}
			on:input={onInput}
			type="text" 
			value="{fragment.path.base}"/>
</li>

<style>
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
	li.selected:hover menu {
		display: flex;
	}

	li gg-icon {
		--ggs: 0.6;
		vertical-align: middle;
		margin-right: 0.5em;
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
