<script lang="ts">
  import type { Doc, Documents as DocumentsType } from "$src/types";

  import asyncWorkerClient from "$src/lib/asyncWorkerClient";

  let {
    Documents,
    onSelect,
  }: {
    Documents: DocumentsType
    onSelect: (doc: Doc) => void
  } = $props()

  const client = asyncWorkerClient(window.navigator.serviceWorker)

  let items = $state([])

  $effect(() => {
    const cursor = Documents.find({ key: /^journals\// });

    $effect(() => {
      const i = cursor.fetch()
      // warm up
      client.rst2html("* foo").then(() => {
        Promise.all(i.map(async (item) => {
          const html = await client.rst2html(item.content)
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
<h2>journals</h2>
<ul>
  {#each items as { html, item } }
    <li onclick={() => onSelect(item)}>
      { item.key }: { item.createdAt }<br>
      {@html html}
    </li>
  {/each}
</ul>
