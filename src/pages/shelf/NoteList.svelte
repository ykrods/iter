<script lang="ts">
  import type { Cursor } from "@signaldb/core";
  import type { Shelf, Doc } from "$src/types";

  import { link, push } from "svelte-spa-history-router";
  import asyncWorkerClient from "$src/lib/asyncWorkerClient";
  import DocViewer from "$src/ui/DocViewer.svelte";

  type Item = {
    html: string
    item: Doc
  };

  let {
    shelf,
    getCursor,
    docUrl,
  }: {
    shelf: Shelf
    getCursor: () => Cursor<Doc, Doc>
    docUrl: (doc: Doc) => string
  } = $props();

  const client = asyncWorkerClient(window.navigator.serviceWorker);
  let items = $state<Item[]>([])

  $effect(() => {
    const cursor = getCursor();

    $effect(() => {
      const l = cursor.fetch()
      Promise.all(l.map(async (item) => {
        const { html } = await client.rst2html(item.content);
        return { html, item };
      })).then(result => { items = result; });
    });

    return () => {
      cursor.cleanup();
    };
  });
</script>
<main>
  <h2>{ shelf.name }</h2>
  <ul>
    {#each items as { item, html }}
      <li>
        <a use:link href={docUrl(item)}>{ item.key }</a>
        <DocViewer {html} onNavigate={(path) => push(path)}></DocViewer>
      </li>
    {/each}
  </ul>
</main>
