<script>
  import { Button, Menu, Menuitem } from 'svelte-mui';
  import { push } from "svelte-spa-history-router";

  import MenuButton from '../ui/buttons/MenuButton.svelte'
  import DeleteConfirmationDialog from '../ui/dialogs/DeleteConfirmationDialog.svelte';
  import RstViewer from '../ui/RstViewer.svelte';
  import FormatDateTime from "../presentation/FormatDateTime.svelte";

  export let project;
  export let issue;

  let editing = false;
  let showDeleteConfirmation = false;

  function doDelete() {
    // TODO
  }
</script>

<svelte:head>
  <title>{issue.title } @ { project.id } | iter</title>
</svelte:head>
<main id="Issue" class="card">
  <Menu origin="top right">
    <div slot="activator">
      <MenuButton />
    </div>
    <Menuitem on:click={ () => { editing = true; }}>Edit</Menuitem>
    <Menuitem style="color: var(--danger, red);" on:click={ () => { showDeleteConfirmation = true }}>Delete</Menuitem>
  </Menu>

  <h1>{ issue.title }</h1>
  <div>status: {issue.status_disp}</div>
  <div>created at: <FormatDateTime value={ issue.created_at }/></div>
  <div>updated at: <FormatDateTime value={ issue.updated_at }/></div>
  <RstViewer rst={issue.body}/>
  <DeleteConfirmationDialog
    bind:visible={showDeleteConfirmation}
    message="Delete the issue '{issue ? issue.title: ''}' ?"
    on:do-delete={doDelete}
  />
</main>

<style>
</style>
