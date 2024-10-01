<script lang="ts">
  import type { Project } from "$src/types";

  import { liveQuery } from "dexie";

  import Layout from "$src/layout/Layout.svelte";
  import SidebarContent from "$src/layout/SidebarContent.svelte";
  import NoteItem from "./note_list/NoteItem.svelte";

  import { asyncWorkerClient } from "$src/lib/asyncWorkerClient";
  import { HtmlProvider } from "$src/lib/HtmlProvider";

  const client = asyncWorkerClient(navigator.serviceWorker, Promise);

  let {
    project
  } : {
    project: Project
  } = $props()


  let _items = liveQuery(async () => {
    const q = await project.db.notes.reverse().toArray();
    return Promise.all(q.map(async (note) => {
      const html = await HtmlProvider(project.db, client).get(note.content);
      return { note, html };
    }));
  });
  let items = $derived($_items);
</script>
<svelte:head>
  <title>Notes @ { project.id } | iter</title>
</svelte:head>
<Layout>
  {#snippet sidebarContent()}
    <SidebarContent {project} />
  {/snippet}

  <main id="Home">
    {#if items }
      <ul class="NoteItems">
        {#each items as { note, html }}
          <li>
            <NoteItem {note} {html} url={ project.url(`/notes/${note.id}`)} />
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
