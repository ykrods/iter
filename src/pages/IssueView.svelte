<script>
  import { Button, Menu, Menuitem } from 'svelte-mui';
  import { push, link } from "svelte-spa-history-router";

  import IssueForm from "../ui/forms/IssueForm.svelte";
  import MenuButton from '../ui/buttons/MenuButton.svelte'
  import DeleteConfirmationDialog from '../ui/dialogs/DeleteConfirmationDialog.svelte';
  import RstViewer from '../ui/RstViewer.svelte';
  import FormatDateTime from "../presentation/FormatDateTime.svelte";

  export let project;
  export let issue;

  let editing = false;
  let showDeleteConfirmation = false;

  async function onIssueSave(event) {
    Object.assign(issue, event.detail);
    await issue.save(project);
    editing = false;
  }

  async function onDeleteConfirmed() {
    await issue.delete(project);
    push(project.url("/issues"));
  }
</script>

<svelte:head>
  <title>{issue.title } @ { project.id } | iter</title>
</svelte:head>
<main id="Issue" class="card">
  {#if !editing }
    <div class="heading--flex">
      <div>
        <div class="breadcrumb"><a use:link href={ project.url("/issues") }>issues</a> / { issue.id }</div>
        <h1>{ issue.title }</h1>
      </div>
      <Menu origin="top right">
        <div slot="activator">
          <MenuButton />
        </div>
        <Menuitem on:click={ () => { editing = true; }}>Edit</Menuitem>
        <Menuitem
          style="color: var(--danger, red);"
          on:click={ () => { showDeleteConfirmation = true }}
        >Delete</Menuitem>
      </Menu>
    </div>

    <div class="meta-list">
      <div>status: {issue.status_disp}</div>
      <div>created at: <FormatDateTime value={ issue.created_at }/></div>
      <div>updated at: <FormatDateTime value={ issue.updated_at }/></div>
    </div>

    <RstViewer rst={issue.body}/>
    <DeleteConfirmationDialog
      bind:visible={showDeleteConfirmation}
      message="Delete the issue '{issue ? issue.title: ''}' ?"
      on:deleteConfirmed={onDeleteConfirmed}
    />
  {:else}
    <IssueForm
      title={issue.title}
      status={issue.status}
      body={issue.body}
      on:save={onIssueSave}
      on:cancel={() => { editing = false; }}
    />
  {/if}
</main>

<style>
.heading--flex h1 {
  margin: 5px 0 10px 0;
}
</style>
