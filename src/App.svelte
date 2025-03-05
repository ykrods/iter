<script lang="ts">
  import EnsureFileSystemAccessAPI from "./EnsureFileSystemAccessAPI.svelte";
  import EnsureServiceWorker from "./EnsureServiceWorker.svelte";

  import { asyncWorkerClient } from "$src/lib/asyncWorkerClient";


  const client = asyncWorkerClient(navigator.serviceWorker);

  $effect(() => {
    client.rst2html(`* foo`).then(r => console.log(r));

    return () => client.close();
  });
</script>
<EnsureFileSystemAccessAPI>
  <EnsureServiceWorker>
    <main>
      hoge
    </main>
  </EnsureServiceWorker>
</EnsureFileSystemAccessAPI>
<style>
</style>
