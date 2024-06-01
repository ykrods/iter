<script lang="ts">
  import { link, push } from "svelte-spa-history-router";

  import { getAllProjects } from "$src/lib/project/getAllProjects";

  import CreateProjectDialog from "$src/ui/dialogs/CreateProjectDialog.svelte";

  import { SLButton } from "$src/ui/shoelace";

  let openCreateProjectDialog = $state(false);
</script>

<svelte:head>
  <title>top | iter</title>
</svelte:head>
<main id="Top">
  <p class="welcome">Iter: Portable project management application</p>
  <p>Iter is a personal project management application <br/>for that requires no registration.</p>
  <p>All data are stored into browser (indexedDB) and will not be sent to the outside.</p>
  <p>See <a target="_blank" href="https://github.com/ykrods/iter#readme">README</a> for details.</p>
  <p>NOTICE: Iter is still expeirmental / in the beta release stage.</p>
  {#await getAllProjects() then projects}
    <div class="selection-card">
      {#if projects.length == 0 }
        <div class="selection-card--header">Let's start your project!</div>
      {:else}
        <div class="selection-card--header">Available projects:</div>
        {#each projects as project }
          <div><a use:link href={ project.url("/") }>{ project.id }</a></div>
        {/each}
      {/if}
      <div class="selection-card--footer">
        <SLButton
          variant="primary"
          onclick={() => { openCreateProjectDialog = true; }}
          >Create project</SLButton>
      </div>
    </div>
  {/await}
</main>
<CreateProjectDialog
  bind:open={openCreateProjectDialog}
  onCreate={ (project) => push(project.url("/")) }
/>

<style>
  #Top { text-align: center; }
  p.welcome {
    font-size: 2.8em;
  }

  .selection-card {
    background-color: white;
    box-shadow: var(--bs-50);
    border-radius: 10px;
    width: 300px;
    margin: 0 auto;
  }
  .selection-card > div {
    border-top: 1px solid #ddd;
  }
  .selection-card > .selection-card--header {
    border-top: none;
    padding: 10px 0;
  }
  .selection-card > .selection-card--footer {
    padding: 10px 0;
  }

  .selection-card > div > a {
    display: block;
    width: 100%;
    padding: 10px 0;
    text-decoration: none;
    color: #333;
    font-weight: bold;
  }

  .selection-card > div > a:hover {
    background-color: #f8f8f8;
  }
</style>
