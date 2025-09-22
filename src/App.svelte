<script lang="ts">
  import EnsureFileSystemAccessAPI from "./components/EnsureFileSystemAccessAPI.svelte";
  import EnsureServiceWorker from "./components/EnsureServiceWorker.svelte";
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
