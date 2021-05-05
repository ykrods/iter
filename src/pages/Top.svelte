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
  <p class="welcome">Welcome to iter app</p>
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
    font-size: 3.2em;
  }
</style>
