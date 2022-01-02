<script>
import SplitPanel from './SplitPanel.svelte'
import ListPanel from './ListPanel.svelte'
import EditorPanel from './EditorPanel.svelte'

import {currentDocument} from './DocumentStore'

let mainDocument
$: mainDocument = $currentDocument
</script>

<main>
	<SplitPanel>
			<ListPanel slot="left"/>
			<EditorPanel slot="center" document={mainDocument}/>
			<!-- <p slot="right">Truly!</p> -->
	</SplitPanel>
</main>

<style>

	main {
		background-color: var(--back-color);
		color: var(--primary-front-color);
		width: 100%;
		height: 100%;
		position: absolute;
	}

</style>