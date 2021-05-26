<script>
  import { link, push } from "svelte-spa-history-router";
  import { Menu, Menuitem } from "svelte-mui";

  import DeleteConfirmationDialog from '../ui/dialogs/DeleteConfirmationDialog.svelte';
  import EditNoteDialog from "../ui/dialogs/EditNoteDialog.svelte"
  import MenuButton from "../ui/buttons/MenuButton.svelte";
  import RstViewer from "../ui/RstViewer.svelte";
  import FormatDateTime from "../presentation/FormatDateTime.svelte";

  export let project;
  export let note;

  let showEditDialog = false;
  let showDeleteConfirmation = false;

  async function onDeleteConfirmed() {
    await note.delete(project);
    push(project.url("/notes"));
  }
</script>

<svelte:head>
  <title>{ note.heading } @ { project.id } | iter</title>
</svelte:head>
<main id="NoteView" class="card">
  <div class="heading--flex">
    <span class="breadcrumb"><a use:link href={ project.url("/notes") }>notes</a> / { note.id }</span>
    <Menu origin="top right">
      <div slot="activator">
        <MenuButton />
      </div>
      <Menuitem on:click={ () => { showEditDialog = true; }}>Edit</Menuitem>
      <Menuitem
        style="color: var(--danger, red);"
        on:click={ () => { showDeleteConfirmation = true; }}
      >Delete</Menuitem>
    </Menu>
  </div>
  <RstViewer rst={ note.body }/>
  <EditNoteDialog bind:visible={showEditDialog} {note} body={note.body}/>
  <DeleteConfirmationDialog
    bind:visible={showDeleteConfirmation}
    message="Delete this note?"
    on:deleteConfirmed={onDeleteConfirmed}
  />
  <div class="meta-list">
    <div>created: <FormatDateTime value={ note.created_at }/></div>
    <div>updated: <FormatDateTime value={ note.updated_at }/></div>
  </div>
</main>
