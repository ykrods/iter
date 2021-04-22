<script>
  import { Button, Menu, Menuitem } from 'svelte-mui';
  import { push } from "svelte-spa-history-router";

  import WikiPageForm from '../ui/forms/WikiPageForm.svelte';
  export let project;
  export let wikiPage;

  let editing = false;
  let showDeleteConfirmation = false;

  async function onSave(event) {
    if (wikiPage.path === event.detail.path) {
      wikiPage.body = event.detail.body;
      await wikiPage.save(project);
      editing = false;

    } else {
      const newPage = new WikiPage(event.detail);
      await newPage.save(project);
      push(project.url(`wiki/${newPage.path}`));
    }
  }
</script>

<svelte:head>
  <title>{ wikiPage.path } @ { project.id } | iter</title>
</svelte:head>
<main id="Wiki" class="card">
  {#if !editing && wikiPage.body}
    hyouzi { wikiPage.body }
  {:else if !editing}
    <p>
      Page does not exist.
      <Button on:click={() => { editing = true; }}>Create</Button>
    </p>
  {:else}
    <WikiPageForm
      on:save={onSave}
      on:cancel={() => { editing = false; }}
      {...wikiPage}
    />
  {/if}
</main>
