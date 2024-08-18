<script lang="ts">
  import "$src/styles/viewer.css";
  import "$src/styles/docutils-0.20.1/math.css";
  import "$src/styles/pygments-2.16.1/default.css";

  import { asyncWorkerClient } from "$src/lib/asyncWorkerClient";

  let { rst } : { rst: string } = $props();

  let html = $state("");

  const client = asyncWorkerClient(navigator.serviceWorker);

  $effect(() => {
    loadHTML(rst);
  });

  async function loadHTML(rst) {
    html = await client.rst2html(rst);
  }
</script>
<div>
  {#if html != ""}
    {@html html}
  {/if}
</div>
