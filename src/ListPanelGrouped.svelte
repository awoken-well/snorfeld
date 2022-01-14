<script>
import {fragments} from './FragmentStore.js'
import FragmentData from './FragmentData.js'
import ListPanelGroup from './ListPanelGroup.svelte'

let groupedFragments = []
$: groupedFragments = FragmentData($fragments).groupByDataKey('type')

</script>

<div class="container">
	{#each groupedFragments as group (group.key)}
	<ListPanelGroup group={group}/>
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
</style>
