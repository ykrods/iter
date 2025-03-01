<script lang="ts">
  import type { Project } from "$src/types";

  import { link } from "svelte-spa-history-router";

  import { SLButton } from "$src/ui/shoelace";
  import AddNoteDialog from "$src/ui/dialogs/AddNoteDialog.svelte";
  import Footer from "./Footer.svelte";

  let { project } : { project: Project } = $props();

  let openAddNoteDialog = $state(false);
</script>
<div class="sidebarContent">
  <ul>
    <li>
      <a use:link href={project.url("/")}>Home</a>
    </li>
    <li>
      <a use:link href={project.url("/docs")}>Docs</a>
    </li>
    <li>
      <a use:link href={project.url("/journals")}>Journals</a>
    </li>
  </ul>
  <SLButton onclick={() => { openAddNoteDialog = true }}>New note</SLButton>
  <a use:link href={project.url("/settings")}>Settings</a>
  <div class="footerContainer">
    <Footer/>
  </div>
</div>
{#if openAddNoteDialog}
  <AddNoteDialog
    bind:open={openAddNoteDialog}
    {project}
    onCreate={(noteId) => { console.log(noteId) }}
    ></AddNoteDialog>
{/if}
<style>
  .sidebarContent {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 100vh;
    border-right: 1px solid var(--sl-color-neutral-200);
    background-color: var(--sl-color-neutral-0);
  }
  .sidebarContent > ul {
    margin-top: 4rem;
    padding: 0;
    list-style: none;
  }
  .sidebarContent > .footerContainer {
    margin-bottom: 0.5rem;
  }
</style>
