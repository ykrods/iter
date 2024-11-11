<script lang="ts">
  import type { Project, Note } from "$src/types";

  import { push } from "svelte-spa-history-router";
  import {
    SLButton,
    SLDivider,
    SLDropdown,
    SLMenu,
    SLMenuItem,
  } from "$src/ui/shoelace";

  import Layout from "$src/layout/Layout.svelte";
  import SidebarContent from "$src/layout/SidebarContent.svelte";
  import Paper from "$src/presentations/Paper.svelte";
  import DocViewer from "$src/presentations/DocViewer.svelte";
  import RstEditor from "$src/ui/RstEditor.svelte";
  import Confirmation from "$src/ui/dialogs/Confirmation.svelte";

  import { asyncWorkerClient } from "$src/lib/asyncWorkerClient";
  import { CachedHtmlProvider } from "$src/lib/HtmlProvider";
  import { getNote } from "$src/lib/note/getNote";
  import { updateNote } from "$src/lib/note/updateNote";
  import { deleteNote } from "$src/lib/note/deleteNote";


  const client = asyncWorkerClient(navigator.serviceWorker, Promise);

  let {
    params,
    project
  } : {
    params: Record<string, string>
    project: Project
  } = $props();

  let note: Note | null = $state(null);
  let editing: boolean = $state(false);
  let editingContent: string = $state("");
  let html: string = $state("");
  let reload: boolean = $state(true);
  let openDeleteConfirmation: boolean = $state(false);

  $effect(() => {
    if (reload && params.noteId) {
      load(params.noteId);
    }
  });

  async function load(noteId: string) {
    note = await getNote(project.db, noteId);
    html = await CachedHtmlProvider(project.db, client).rst2html(note.content);
    reload = false;
  }

  function onEdit() {
    if (editingContent == "") {
      editingContent = note.content;
    }
    editing = true;
  }

  async function onSave() {
    await updateNote(project.db, note.id, editingContent);
    editing = false;
    reload = true;
  }

  async function onDeleteConfirmed() {
    await deleteNote(project.db, note.id);
    push(project.url("/notes"));
  }

  let savable = $derived(editingContent !== "" && editingContent !== note.content);
</script>
<svelte:head>
  <title>{ params.noteId } @ { project.id } | iter</title>
</svelte:head>
<Layout>
  {#snippet sidebarContent()}
    <SidebarContent {project} />
  {/snippet}

  <main id="Note">
    {#if note !== null }
      {#if editing}
        <section class="edit">
          <RstEditor bind:content={editingContent}></RstEditor>
          <SLButton onclick={() => { editing = false }}>Cancel</SLButton>
          <SLButton onclick={onSave} variant="primary" disabled={!savable}>Save</SLButton>
        </section>
      {:else}
        <SLDropdown>
          {#snippet trigger()}
            <SLButton slot="trigger" caret>Edit</SLButton>
          {/snippet}
          <SLMenu>
            <SLMenuItem onclick={onEdit}>Edit</SLMenuItem>
            <SLDivider></SLDivider>
            <SLMenuItem
              onclick={() => { openDeleteConfirmation = true; }}
            ><span style="color: red;">Delete</span></SLMenuItem>
          </SLMenu>
        </SLDropdown>

        <Paper>
          {#snippet meta()}
            <span>ID: { note.id }</span>
            <span>{ note.createdAt }</span>
          {/snippet}
          <DocViewer {html}/>
        </Paper>
      {/if}
    {/if}
  </main>
</Layout>
<Confirmation
  bind:open={openDeleteConfirmation}
  label="Delete this note?"
  onConfirmed={onDeleteConfirmed}
></Confirmation>
<style>
  main#Note {
    padding: 20px;

    &> .edit {
      background-color: white;
      padding: 20px;
    }
  }
</style>
