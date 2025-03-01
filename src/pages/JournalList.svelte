<script lang="ts">
  import type { Project } from "$src/types";

  import { liveQuery } from "dexie";

  import Layout from "$src/layout/Layout.svelte";
  import SidebarContent from "$src/layout/SidebarContent.svelte";
  import JournalItem from "./journal_list/JournalItem.svelte";

  import { asyncWorkerClient } from "$src/lib/asyncWorkerClient";
  import { CachedHtmlProvider } from "$src/lib/HtmlProvider";


  const client = asyncWorkerClient(navigator.serviceWorker, Promise);

  let {
    project
  } : {
    project: Project
  } = $props()

  $effect(() => {
    return () => { client.close(); };
  });

  let _items = liveQuery(async () => {
    const q = await project.db.docs.filter(doc => doc.key.startsWith("journals")).reverse().toArray();
    return Promise.all(q.map(async (doc) => {
      const html = await CachedHtmlProvider(project.db, client).rst2html(doc.content);
      return { doc, html };
    }));
  });
  let items = $derived($_items);
</script>
<svelte:head>
  <title>Journals @ { project.id } | iter</title>
</svelte:head>
<Layout>
  {#snippet sidebarContent()}
    <SidebarContent {project} />
  {/snippet}

  <main id="JournalList">
    {#if items }
      <ul class="JournalItems">
        {#each items as { doc, html }}
          <li>
            <JournalItem {doc} {html} url={ project.url(`/docs/${doc.key}`)} />
          </li>
        {/each}
      </ul>
    {/if}
  </main>
</Layout>
<style>
  main#JournalList {
    padding: 20px;

    & ul.JournalItems {
      padding-left: 0;
      margin: 0;

      & li {
        list-style: none;

        &:nth-child(n+2) {
          margin-top: 20px;
        }
      }
    }
  }
</style>
