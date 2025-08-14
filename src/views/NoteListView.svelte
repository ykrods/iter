<script lang="ts">
  import type { Cursor } from "@signaldb/core";
  import type { Shelf, Doc } from "$src/types";

  import DocViewer from "$src/ui/DocViewer.svelte";
  import Paper from "$src/ui/presentations/Paper.svelte";
  import FormatDateTime from "$src/ui/presentations/FormatDateTime.svelte";
  import asyncWorkerClient from "$src/lib/asyncWorkerClient";

  type Item = {
    html: string
    item: Doc
  };

  let {
    shelf,
    getCursor,
    onSelect,
    onNavigate,
  }: {
    shelf: Shelf
    getCursor: () => Cursor<Doc, Doc>
    onSelect: (doc: Doc) => void
    onNavigate: (key: string) => void
  } = $props()

  const client = asyncWorkerClient(window.navigator.serviceWorker)

  let items = $state<Item[]>([])

  $effect(() => {
    const cursor = getCursor();

    $effect(() => {
      const i = cursor.fetch()
      // warm up
      client.rst2html("* foo").then(() => {
        Promise.all(i.map(async (item) => {
          const html = await client.rst2html(item.content);
          return { html, item }
        })).then(ret => { items = ret; });
      });
    });

    return () => {
      cursor.cleanup();
    };
  });

  $effect(() => {
    return () => client.close()
  });
</script>
<h2>{ shelf.name }</h2>
<ul>
  {#each items as { html, item } }
    <li class="mt-5">
      <Paper>
        {#snippet meta()}
          <button class="btn btn-sm btn-ghost" onclick={() => onSelect(item)}>
            ID:{ item.key }
          </button>
          <FormatDateTime value={ item.createdAt }/>
        {/snippet}
        <DocViewer {html} {onNavigate}/>
      </Paper>
    </li>
  {/each}
</ul>
