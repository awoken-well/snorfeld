<script>
import SplitPanel from './components/layout/SplitPanel.svelte'
import ListPanelGrouped from './ListPanelGrouped.svelte'
import EditorPanel from './EditorPanel.svelte'
import WelcomePanel from './WelcomePanel.svelte'
import ResizableFlex from './components/layout/ResizableFlex.svelte'
import CardPanel from './CardPanel.svelte'

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
		<ResizableFlex>
				<ListPanelGrouped slot="left"/>
				<EditorPanel slot="center" document={mainDocument}/>
				<CardPanel slot="right"/>
					<!-- <p slot="right">Truly!</p> -->
		</ResizableFlex>
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