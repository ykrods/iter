<script lang="ts">
  import type { Doc } from "$src/types";

  import asyncWorkerClient from "$src/lib/asyncWorkerClient";

  let { doc }: { doc: Doc } = $props()

  const client = asyncWorkerClient(window.navigator.serviceWorker);

  $effect(() => {
    return () => client.close();
  });

</script>
<div>
  { doc.key } { doc.createdAt }<br>
  {#await client.rst2html(doc.content) then html}
    {@html html}
  {/await}
</div>
