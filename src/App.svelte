<script lang="ts">
  import { SLApp } from "$src/ui/shoelace";

  import EnsureServiceWorker from "./EnsureServiceWorker.svelte";
  import Router from "./Router.svelte";
</script>
<EnsureServiceWorker>
  <SLApp basePath="/shoelace">
    <Router />
  </SLApp>
</EnsureServiceWorker>
