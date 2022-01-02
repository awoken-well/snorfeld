<script>
import {get} from 'svelte/store'
import {fragments, selectedFragment} from './FragmentStore.js'

function selectFragment(fragment) {
	$selectedFragment = fragment
}

let fragmentList = []
$: fragmentList = Object.values($fragments).sort((a,b) => ('' + get(a).path).localeCompare(get(b).path))

</script>

<ul>
	{#each fragmentList as fragment (get(fragment).id)}
		<li on:click={selectFragment(fragment)}>{get(fragment).slug}</li>
	{/each}
</ul>


