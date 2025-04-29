<script lang="ts">
  import EnsureServiceWorker from "./EnsureServiceWorker.svelte";
  import { asyncWorkerClient } from "$src/lib/asyncWorkerClient";

  const client = asyncWorkerClient(navigator.serviceWorker);

  $effect(() => {
    client.rst2html("* foo\n* bar").then(r => console.log(r));

    return () => client.close();
  });
</script>
<EnsureServiceWorker path="/sw.js">
  <main>
    foo
  </main>
</EnsureServiceWorker>
<style>
</style>
