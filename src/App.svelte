<script lang="ts">
  import EnsureFileSystemAccessAPI from "./EnsureFileSystemAccessAPI.svelte";
  import EnsureServiceWorker from "./EnsureServiceWorker.svelte";
  import { asyncWorkerClient } from "$src/lib/asyncWorkerClient";

  const client = asyncWorkerClient(navigator.serviceWorker);

  $effect(() => {
    client.rst2html("* foo\n* bar").then(r => console.log(r));

    return () => client.close();
  });
</script>
<EnsureFileSystemAccessAPI>
  <EnsureServiceWorker path="/sw.js">
    <main>
      foo
    </main>
  </EnsureServiceWorker>
</EnsureFileSystemAccessAPI>
<style>
</style>
