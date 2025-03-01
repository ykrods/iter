<script lang="ts">
  import type { Project, Doc } from "$src/types";

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
  import FormatDateTime from "$src/presentations/FormatDateTime.svelte";
  import RstEditor from "$src/ui/RstEditor.svelte";
  import Confirmation from "$src/ui/dialogs/Confirmation.svelte";

  import { asyncWorkerClient } from "$src/lib/asyncWorkerClient";
  import { CachedHtmlProvider } from "$src/lib/HtmlProvider";
  import { getDoc } from "$src/lib/doc/getDoc";
  import { updateDoc } from "$src/lib/doc/updateDoc";
  import { deleteDoc } from "$src/lib/doc/deleteDoc";


  const client = asyncWorkerClient(navigator.serviceWorker, Promise);

  let {
    params,
    project
  } : {
    params: Record<string, string>
    project: Project
  } = $props();

  let doc: Doc | undefined = $state();
  let editing: boolean = $state(false);
  let editingContent: string = $state("");
  let html: string = $state("");
  let reload: boolean = $state(true);
  let openDeleteConfirmation: boolean = $state(false);

  $effect(() => {
    if (reload && params.key) {
      load(params.key);
    }
  });

  async function load(key: string) {
    doc = await getDoc(project.db, key);
    if (doc) {
      html = await CachedHtmlProvider(project.db, client).rst2html(doc.content);
    }
    reload = false;
  }

  function onEdit() {
    if (editingContent == "") {
      editingContent = (doc?.content ?? "");
    }
    editing = true;
  }

  async function onSave() {
    if (doc) {
      await updateDoc(project.db, doc.key, editingContent);
    }
    editing = false;
    reload = true;
  }

  async function onDeleteConfirmed() {
    if (doc) {
      await deleteDoc(project.db, doc.key);
    }
    push(project.url("/docs"));
  }

  let savable = $derived(editingContent !== "" && editingContent !== (doc?.content ?? ""));
</script>
<svelte:head>
  <title>{ params.key } @ { project.id } | iter</title>
</svelte:head>
<Layout>
  {#snippet sidebarContent()}
    <SidebarContent {project} />
  {/snippet}

  <main id="Doc">
    {#if doc }
      {#if editing}
        <section class="edit">
          <RstEditor bind:content={editingContent}></RstEditor>
          <div class="action">
            <SLButton onclick={() => { editing = false }}>Cancel</SLButton>
            <SLButton onclick={onSave} variant="primary" disabled={!savable}>Save</SLButton>
          </div>
        </section>
      {:else}
        <div class="menu">
          <SLDropdown>
            {#snippet trigger()}
              <SLButton caret>Edit</SLButton>
            {/snippet}
            <SLMenu>
              <SLMenuItem onclick={onEdit}>Edit</SLMenuItem>
              <SLDivider></SLDivider>
              <SLMenuItem
                onclick={() => { openDeleteConfirmation = true; }}
                ><span style="color: red;">Delete</span></SLMenuItem>
            </SLMenu>
          </SLDropdown>
        </div>
        <Paper>
          {#snippet meta()}
            <!-- snippet requires null check because it is a function -->
            {#if doc }
              <span>ID:{ doc.key }</span>
              <FormatDateTime value={ doc.createdAt }/>
            {/if}
          {/snippet}
          <DocViewer {html}/>
        </Paper>
      {/if}
    {/if}
  </main>
</Layout>
<Confirmation
  bind:open={openDeleteConfirmation}
  label="Delete this doc?"
  onConfirmed={onDeleteConfirmed}
></Confirmation>
<style>
  main#Doc {
    padding: 20px;

    &> .edit {
      background-color: white;
      padding: 20px;

      & .action {
        margin-top: 20px;
      }
    }

    & .menu {
      margin-bottom: 15px;
    }
  }
</style>
