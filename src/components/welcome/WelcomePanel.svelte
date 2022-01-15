<script>
  import {openProject} from '../../stores/FileStore.js'

  let history = window.api.getProjectHistory()
</script>

<div class="container">
  <h1>Welcome to Snorfeld</h1>
  <p>Please open a project.</p>
  <ul>
    {#each history as project}
    <li on:click={()=>openProject(project.path)}><span class="name">{project.dir}</span><span class="folder">({project.path})</span></li>
    {/each}
  </ul>
</div>

<style>
  .container {
    width: 80%;
    margin: 1em auto;
  }
  ul {
		list-style: none;
	}

	li {
		position: relative;
		white-space: nowrap;
		line-height: 1.5em;
	}

  li {
    color: var(--emphasis-front-color);
    cursor: pointer;
  }

	li:hover {
		color: var(--ui-selected-front-color);
	}

  .folder {
    font-size: 0.8em;
    display: block;
  }
</style>