<script lang="ts">
  import EnsureFileSystemAccessAPI from "./EnsureFileSystemAccessAPI.svelte";
  import EnsureServiceWorker from "./EnsureServiceWorker.svelte";
  import { SLApp } from "$src/ui/shoelace";
  import Main from "./Main.svelte";
</script>
<div>
  <EnsureFileSystemAccessAPI>
    <EnsureServiceWorker path="/sw.js">
      <SLApp basePath="/shoelace">
        <Main></Main>
      </SLApp>
    </EnsureServiceWorker>
  </EnsureFileSystemAccessAPI>
</div>
