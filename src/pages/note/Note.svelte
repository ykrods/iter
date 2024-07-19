<script lang="ts">
  import type { Project } from "$src/types";

  import { push } from "svelte-spa-history-router";

  import Layout from "$src/layout/Layout.svelte";
  import SidebarContent from "$src/layout/SidebarContent.svelte";
  import RstViewer from "$src/presentations/RstViewer.svelte";
  import Paper from "$src/presentations/Paper.svelte";
  import Confirmation from "$src/ui/dialogs/Confirmation.svelte";

  import { SLButton, SLTextarea } from "$src/ui/shoelace";
  import { getNote } from "$src/lib/note/getNote";
  import { updateNote } from "$src/lib/note/updateNote";
  import { deleteNote } from "$src/lib/note/deleteNote";

  let {
    params,
    project,
  }: {
    params: Record<string, string>
    project: Project
  } = $props();

  let note: Note = $state(null);
  let editing: boolean = $state(false);
  let editingContent: string = $state("");
  let refresh: boolean = $state(true);
  let showDeleteConfirmation: boolean = $state(false);

  $effect(() => {
    console.log(`noteId: ${params.noteId}`);
    if (params.noteId) {
      load(params.noteId).then(() => {
        refresh = false;
      });
    }
  });

  $effect(() => {
    if (refresh) {
      load(params.noteId).then(() => {
        refresh = false;
      });
    }
  });

  async function load() {
    note = await getNote(project.db, params.noteId);
  }

  function onEdit() {
    editingContent = note.content;
    editing = true;
  }

  function onCancel() {
    editing = false;
  }

  async function onSave() {
    if (note.content !== editingContent) {
      await updateNote(project.db, note.id, editingContent);
      refresh = true;
    }
    editing = false;
  }

  async function onDeleteConfirmed() {
    await deleteNote(project.db, params.noteId);
    push(`/${project.id}/notes`);
  }
</script>
<svelte:head>
  <title>{ params.noteId } @ { project.id } | iter</title>
</svelte:head>
<Layout>
  {#snippet sidebarContent()}
    <SidebarContent {project} />
  {/snippet}

  <main id="Home">
    {#if note !== null }
      <Paper>
        {#snippet meta()}
          <span>ID: { note.id }</span>
        {/snippet}
        {#if editing}
          <SLTextarea bind:value={editingContent} resize="auto"/>
        {:else}
          <RstViewer rst={ note.content }/>
        {/if}
      </Paper>
      <div>
        {#if editing}
          <SLButton onclick={() => { showDeleteConfirmation = true; }}>Delete</SLButton>
          <SLButton onclick={onCancel}>Cancel</SLButton>
          <SLButton onclick={onSave}>Save</SLButton>
        {:else}
          <SLButton onclick={onEdit}>Edit</SLButton>
        {/if}
      </div>
    {/if}
  </main>
</Layout>
<Confirmation
  bind:open={showDeleteConfirmation}
  label="delete this note?"
  onConfirmed={onDeleteConfirmed}
/>
<style>
  main#Home {
    margin: 20px;
  }
</style>
