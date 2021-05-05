<script>
  import { Menu, Menuitem } from "svelte-mui";

  import { currentProject } from "../../stores.js";

  import RstViewer from "../RstViewer.svelte";
  import DeleteConfirmationDialog from '../dialogs/DeleteConfirmationDialog.svelte';
  import EditNoteDialog from "../dialogs/EditNoteDialog.svelte"
  import MenuButton from "../buttons/MenuButton.svelte";

  export let note;

  let showEditDialog = false;
  let showDeleteConfirmation = false;

  async function onDeleteConfirmed() {
    await note.delete($currentProject);
  }
</script>

<div class="card item">
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
  <RstViewer rst={ note.body }/>
  <EditNoteDialog bind:visible={showEditDialog} {note} body={note.body}/>
  <DeleteConfirmationDialog
    bind:visible={showDeleteConfirmation}
    message="Delete this note?"
    on:deleteConfirmed={onDeleteConfirmed}
  />
</div>

<style>
  .item { margin: 10px 0; }
</style>
