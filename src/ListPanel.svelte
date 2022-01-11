<script>
import {get} from 'svelte/store'
import {fragments, selectedFragment} from './FragmentStore.js'

function selectFragment(fragment) {
	selectedFragment.set(fragment)
}

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

<ul>
	{#each fragmentList as fragment (get(fragment).id)}
		<li on:click={selectFragment(fragment)} 
			on:keyup={onKeyUp} 
			tabindex="0" 
			class:selected={$selectedFragment && get(fragment).id == get($selectedFragment).id} 
			class:editable="{$selectedFragment && get(fragment).id == get($selectedFragment).id && renameMode.mode}" >
				<span>{get(fragment).slug}</span>
				<input 
					on:blur={onUnfocus}
					on:input={onInput}
					type="text" 
					value="{get(fragment).filename}"/>
			</li>
	{/each}
</ul>

<style>
	ul {
		overflow-y: scroll;
		position: absolute;
		overflow-x: hidden;
		width: 100%;
		height: 100%;
		padding: 0.5em;
		list-style: none;
		font-size: 0.8em;
		box-sizing: border-box;
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

</style>
