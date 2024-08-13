<script lang="ts">
  import EnsureServiceWorker from "./EnsureServiceWorker.svelte";

  import Router from "./Router.svelte";
</script>
<EnsureServiceWorker>
  <Router />
</EnsureServiceWorker>
