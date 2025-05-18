<script lang="ts">
  import EnsureFileSystemAccessAPI from "./EnsureFileSystemAccessAPI.svelte";
  import EnsureServiceWorker from "./EnsureServiceWorker.svelte";
  import { SLApp } from "$src/ui/shoelace";
  import Router from "./Router.svelte";
</script>
<div>
  <EnsureFileSystemAccessAPI>
    <EnsureServiceWorker path="/sw.js">
      <SLApp basePath="/shoelace">
        <Router/>
      </SLApp>
    </EnsureServiceWorker>
  </EnsureFileSystemAccessAPI>
</div>
