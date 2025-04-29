<script lang="ts">
  import EnsureServiceWorker from "./EnsureServiceWorker.svelte";
</script>
<EnsureServiceWorker path="/sw.js">
  <main>
    foo
  </main>
</EnsureServiceWorker>
<style>
</style>
