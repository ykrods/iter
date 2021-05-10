<script>
  import { Button, Menu, Menuitem } from 'svelte-mui';
  import { push } from "svelte-spa-history-router";

  import { snackbarMessage } from "../stores.js";
  import { WikiPage } from "../models/wiki_page.js";

  import DeleteConfirmationDialog from "../ui/dialogs/DeleteConfirmationDialog.svelte";
  import MenuButton from "../ui/buttons/MenuButton.svelte";
  import WikiPageForm from '../ui/forms/WikiPageForm.svelte';
  import RstViewer from "../ui/RstViewer.svelte";
  import BreadCrumb from '../ui/BreadCrumb.svelte';

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
      try {
        await newPage.save(project);
        push(project.url(`wiki/${newPage.path}`));
      } catch (e) {
        snackbarMessage.error(e.toString());
      }
    }
  }
  async function onDeleteConfirmed() {
    await wikiPage.delete(project);
    wikiPage = new WikiPage({ path: wikiPage.path, body: "" });
  }
</script>

<svelte:head>
  <title>{ wikiPage.path } @ { project.id } | iter</title>
</svelte:head>
<main id="Wiki" class="card">
  {#if !editing && wikiPage.body}
    <BreadCrumb path={wikiPage.path} {project}/>
    <Menu origin="top right">
      <div slot="activator">
        <MenuButton />
      </div>
      <Menuitem on:click={() => { editing = true; }}>Edit</Menuitem>
      <Menuitem
        style="color: var(--danger);"
        on:click={() => { showDeleteConfirmation = true; }}
      >Delete</Menuitem>
    </Menu>

    <RstViewer rst={ wikiPage.body }/>

    <DeleteConfirmationDialog
      bind:visible={showDeleteConfirmation}
      message="Delete the wiki '{wikiPage ? wikiPage.path: ''}' ?"
      on:deleteConfirmed={onDeleteConfirmed}
    />

  {:else if !editing}
    <BreadCrumb path={wikiPage.path} {project}/>
    <p>
      Page does not exist.
      <Button on:click={() => { editing = true; }}>Create</Button>
    </p>
  {:else}
    <WikiPageForm
      on:save={onSave}
      on:cancel={() => { editing = false; }}
      path={wikiPage.path}
      body={wikiPage.body}
    />
  {/if}
</main>
