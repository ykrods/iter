<script lang="ts">
  import EnsureServiceWorker from "./EnsureServiceWorker.svelte";

  import { asyncWorkerClient } from "$src/lib/asyncWorkerClient";

  const client = asyncWorkerClient(navigator.serviceWorker);

  $effect(() => {
    client.rst2html(`* foo`).then(r => console.log(r));

    return () => client.close();
  });

</script>
<EnsureServiceWorker>
  <main>
    hoge
  </main>
</EnsureServiceWorker>
<style>
</style>
