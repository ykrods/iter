<script>
  import { link, push } from "svelte-spa-history-router";
  import { Menu, Menuitem } from "svelte-mui";

  import { dbEvents } from "../stores.js";
  import { Note } from "../models/note.js";

  import DeleteConfirmationDialog from '../ui/dialogs/DeleteConfirmationDialog.svelte';
  import EditNoteDialog from "../ui/dialogs/EditNoteDialog.svelte"
  import MenuButton from "../ui/buttons/MenuButton.svelte";
  import RstViewer from "../ui/RstViewer.svelte";
  import FormatDateTime from "../presentation/FormatDateTime.svelte";

  export let project;
  export let note;

  let showEditDialog = false;
  let showDeleteConfirmation = false;
  let body = note.body;

  async function onDeleteConfirmed() {
    await note.delete(project);
    push(project.url("/notes"));
  }

  $: reloadIfNeeds($dbEvents);

  async function reloadIfNeeds(events) {
    if (!note) {
      return;
    }
    const isUpdated = (event) => {
      return (event.model === "Note" && event.op === "UPDATED" && event.obj.id === note.id);
    };

    if (!events.some((event) => isUpdated(event))) {
      return;
    }
    Note.get(project, note.id).then(n => { note = n; body = note.body; });
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
  <!-- Because body is binded to textarea and cause a problem when rebinding (updating),
       binding body instead of note.body.
  -->
  <EditNoteDialog bind:visible={showEditDialog} id={note.id} {body} />
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
