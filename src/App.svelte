<script>
import ListPanelGrouped from './components/listpanel/ListPanelGrouped.svelte'
import EditorPanel from './components/editorpanel/EditorPanel.svelte'
import WelcomePanel from './components/welcome/WelcomePanel.svelte'
import ResizableFlex from './components/layout/ResizableFlex.svelte'
import CardPanel from './components/cardpanel/CardPanel.svelte'

import {currentDocument} from './stores/DocumentStore'
import {files} from './stores/FileStore'

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