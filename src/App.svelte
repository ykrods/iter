<script lang="ts">
  import EnsureFileSystemAccessAPI from "./EnsureFileSystemAccessAPI.svelte";
  import EnsureServiceWorker from "./EnsureServiceWorker.svelte";
  import { SLApp } from "$src/ui/shoelace";
  import Main from "./views/Main.svelte";
</script>
<div>
  <EnsureFileSystemAccessAPI>
    <EnsureServiceWorker path="/sw.js">
      <SLApp basePath="/shoelace">
        <Main/>
      </SLApp>
    </EnsureServiceWorker>
  </EnsureFileSystemAccessAPI>
</div>
