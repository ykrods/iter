<script>
  import { Button } from "svelte-mui";
  import { link } from "svelte-spa-history-router";

  import AddProjectDialog from "../ui/dialogs/AddProjectDialog.svelte";

  export let projects = [];
  let showAddProjectDialog = false;

  function onClickAddProject() {
    showAddProjectDialog = true;
  }
</script>

<svelte:head>
  <title>top | iter</title>
</svelte:head>
<main id="Top">
  <p class="welcome">Iter: Portable project management application</p>
  <p>Iter is a personal project management application <br/>for that requires no registration.</p>
  <p>All data are stored into browser (indexedDB) and will not be sent to the outside.</p>
  <p>See <a target="_blank" href="https://github.com/ykrods/iter#README">README</a> for details.</p>
  <p>NOTICE: Iter is still expeirmental / in the beta release stage.</p>
  <div class="selection-card">
    {#if projects.length == 0 }
      <div class="selection-card--header">Let's start your project!</div>
    {:else}
      <div class="selection-card--header">Available projects:</div>
      {#each projects as project }
        <div><a use:link href={ project.url("/issues") }>{ project.id }</a></div>
      {/each}
    {/if}
    <div class="selection-card--footer">
      <Button id="openDialog" color="primary" unelevated on:click={onClickAddProject}>Create project</Button>
    </div>
  </div>
</main>
<AddProjectDialog bind:visible={showAddProjectDialog} />
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
