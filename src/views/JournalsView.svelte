<script lang="ts">
  import type { Doc, Documents as DocumentsType } from "$src/types";

  import DocViewer from "$src/ui/DocViewer.svelte";
  import Paper from "$src/ui/presentations/Paper.svelte";
  import FormatDateTime from "$src/ui/presentations/FormatDateTime.svelte";
  import asyncWorkerClient from "$src/lib/asyncWorkerClient";

  let {
    Documents,
    onSelect,
    onNavigate,
  }: {
    Documents: DocumentsType
    onSelect: (doc: Doc) => void
    onNavigate: (key: string) => void
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
<ul class="journal-items">
  {#each items as { html, item } }
    <li onclick={() => onSelect(item)}>
      <Paper>
        {#snippet meta()}
          <span>ID:{ item.key }</span>
          <FormatDateTime value={ item.createdAt }/>
        {/snippet}
        <DocViewer {html} {onNavigate}/>
      </Paper>
    </li>
  {/each}
</ul>
<style>
  ul.journal-items {
    padding-left: 0;
    margin: 0;

    & > li {
      list-style: none;

      &:nth-child(n+2) {
        margin-top: 20px;
      }
    }
  }
</style>
