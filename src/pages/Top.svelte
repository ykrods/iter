<script>
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import { link } from "svelte-spa-history-router";

  import { Project } from "../models/project.js";

  import CreateProjectDialog from "../ui/dialogs/CreateProjectDialog.svelte";
  import Footer from "../layouts/Footer.svelte";

  let showCreateProjectDialog = false;
</script>
<svelte:head>
  <title>top | iter</title>
</svelte:head>
<main id="Top">
  <p class="welcome">Iter: Portable project management application</p>
  <p>Iter is a personal project management application <br/>for that requires no registration.</p>
  <p>All data are stored into browser (indexedDB) and will not be sent to the outside.</p>
  <p>See <a target="_blank" rel="noreferrer" href="https://github.com/ykrods/iter#readme">README</a> for details.</p>
  <p>NOTICE: Iter is still expeirmental / in the beta release stage.</p>
  <div class="selection-card">
    {#await Project.list() then projects}
      {#if projects.length == 0 }
        <div class="selection-card--header">Let's start your project!</div>
      {:else}
        <div class="selection-card--header">Available projects:</div>
        {#each projects as project }
          <div><a use:link href={ project.url("/journals") }>{ project.id }</a></div>
        {/each}
      {/if}
    {/await}
    <div class="selection-card--footer">
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <sl-button variant="primary" on:click={ () => { showCreateProjectDialog = true; }}>Create Project</sl-button>
    </div>
  </div>
  <Footer/>
</main>
<CreateProjectDialog bind:open={showCreateProjectDialog}/>
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
