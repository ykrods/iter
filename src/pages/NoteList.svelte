<script lang="ts">
  import type { Project } from "$src/types";

  import { liveQuery } from "dexie";

  import Layout from "$src/layout/Layout.svelte";
  import SidebarContent from "$src/layout/SidebarContent.svelte";
  import NoteItem from "./note_list/NoteItem.svelte";

  let {
    project
  } : {
    project: Project
  } = $props()

  let notes = $derived(liveQuery(() => project.db.notes.reverse().toArray()));
</script>
<svelte:head>
  <title>Notes @ { project.id } | iter</title>
</svelte:head>
<Layout>
  {#snippet sidebarContent()}
    <SidebarContent {project} />
  {/snippet}

  <main id="Home">
    {#if $notes }
      <ul class="NoteItems">
        {#each $notes as note}
          <li>
            <NoteItem {note} url={ project.url(`/notes/${note.id}`)} />
          </li>
        {/each}
      </ul>
    {/if}
  </main>
</Layout>
<style>
  ul.NoteItems {
    padding-left: 0;

    & li {
      list-style: none;
    }
  }
</style>
