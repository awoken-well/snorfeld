<script>
import ListPanelItem from './ListPanelItem.svelte'
import FragmentData from '../../stores/FragmentData.js'
import {fragments} from '../../stores/FragmentStore.js'
import {createWithData} from '../../stores/FileStore.js'

export let group
export let key

let folded = false

function addNewFragment(e) {
	const fragment = FragmentData($fragments).newFragmentForKeyValue(key, group.key)
	createWithData(fragment.path, fragment.parsed)
}

</script>

<section>
	<header><gg-icon on:click={(e)=>{folded = !folded}} class="{folded ? 'gg-chevron-right' : 'gg-chevron-down'}"></gg-icon> {group.key}
	<menu><gg-icon on:click={addNewFragment} class="gg-add"></gg-icon></menu>
	</header>
	<ul class:folded>
		{#each group.values as fragment (fragment.id)}
			<ListPanelItem fragment={fragment} />
		{/each}
	</ul>
</section>


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

	ul {
		list-style: none;
		padding: 0.5em 0.5em 1em 0.5em; 
		box-sizing: border-box;
		margin: 0;
	}
	ul.folded {
		display: none;
	}
	gg-icon {
		display: inline-block;
		vertical-align: bottom;
	}

	header gg-icon {
		cursor: pointer;
	}
</style>
