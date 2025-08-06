<script lang="ts">
  import EnsureFileSystemAccessAPI from "./EnsureFileSystemAccessAPI.svelte";
  import EnsureServiceWorker from "./EnsureServiceWorker.svelte";
  import Main from "./views/Main.svelte";
</script>
<div>
  <EnsureFileSystemAccessAPI>
    <EnsureServiceWorker path="/sw.js">
      <Main/>
    </EnsureServiceWorker>
  </EnsureFileSystemAccessAPI>
</div>
