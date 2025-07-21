<script lang="ts">
  import type { Doc } from "$src/types";

  import DocViewer from "$src/ui/DocViewer.svelte";
  import Paper from "$src/ui/presentations/Paper.svelte";
  import FormatDateTime from "$src/ui/presentations/FormatDateTime.svelte";
  import asyncWorkerClient from "$src/lib/asyncWorkerClient";

  let { doc }: { doc: Doc } = $props()

  const client = asyncWorkerClient(window.navigator.serviceWorker);

  $effect(() => {
    return () => client.close();
  });

</script>
<div>
  {#await client.rst2html(doc.content) then html}
    <Paper>
      {#snippet meta()}
        <span>ID:{ doc.key }</span>
        <FormatDateTime value={ doc.createdAt }/>
      {/snippet}
      <DocViewer {html} onNavigate={(key) => console.log(key)}/>
    </Paper>
  {/await}
</div>
