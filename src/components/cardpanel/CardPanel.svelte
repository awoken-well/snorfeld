<script>
import {fragments} from '../../stores/FragmentStore.js'
import FragmentData from '../../stores/FragmentData.js'

let groupedFragments = []
$: groupedFragments = FragmentData($fragments).groupByDataKeyValue('type','scene')

</script>

<div class="container">
	{#each groupedFragments as fragment (fragment.id)}
		<card>
			<header>{fragment.slug}</header>
			{#each Object.keys(fragment.parsed.data) as key}
				<p title="{key}">{fragment.parsed.data[key]}</p>
			{/each}
		</card>
	{/each}
</div>


<style>
	.container {
		overflow-y: auto;
		position: absolute;
		overflow-x: hidden;
		width: 100%;
		height: 100%;
		font-size: 0.8em;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: center;
		align-items: flex-start;
		align-content: baseline;		
	}

	card {
		border: 1px solid var(--header-back-color);
		border-radius: 0.5em;
		display: block;
		width: 30ch;
		margin: 0.5em;
	}

	card header {
		border-radius: 0.5em 0.5em 0 0;
		text-align: center;
		user-select: none;
		line-height: 1.5em;
		padding: 0 0.25em;
		background-color: var(--header-back-color);
		font-weight: bold;
	}

	card p {
		margin: 0.5em;
	}
</style>
