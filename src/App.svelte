<script lang="ts">
  import EnsureFileSystemAccessAPI from "./EnsureFileSystemAccessAPI.svelte";
  import EnsureServiceWorker from "./EnsureServiceWorker.svelte";
  import Router from "./Router.svelte";
</script>
<div>
  <EnsureFileSystemAccessAPI>
    <EnsureServiceWorker path="/sw.js">
      <Router/>
    </EnsureServiceWorker>
  </EnsureFileSystemAccessAPI>
</div>
<style>
</style>
