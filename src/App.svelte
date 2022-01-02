<script>
import SplitPanel from './SplitPanel.svelte'
import ListPanel from './ListPanel.svelte'
import EditorPanel from './EditorPanel.svelte'
import WelcomePanel from './WelcomePanel.svelte'

import {currentDocument} from './DocumentStore'
import {files} from './FileStore'

let mainDocument
$: mainDocument = $currentDocument

let showWelcome
$: showWelcome = Object.values($files).length == 0
</script>


<main>
	{#if showWelcome}
		<WelcomePanel/>
	{:else}
		<SplitPanel>
				<ListPanel slot="left"/>
				<EditorPanel slot="center" document={mainDocument}/>
					<!-- <p slot="right">Truly!</p> -->
		</SplitPanel>
	{/if}
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