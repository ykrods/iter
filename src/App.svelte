<script lang="ts">
  import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path';

  import EnsureServiceWorker from "./EnsureServiceWorker.svelte";
  import Router from "./Router.svelte";

  setBasePath('/shoelace');
</script>
<EnsureServiceWorker>
  <Router />
</EnsureServiceWorker>
