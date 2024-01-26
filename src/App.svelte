<script>
  import { onMount } from "svelte";

  import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js';

  import Router from "./Router.svelte";
  import { initAsyncMessage } from "$src/worker/client.js";

  // css bundle
  import "./static/global.css";

  setBasePath('/_/shoelace');

  const requirements = [
    (typeof window.showDirectoryPicker === 'function'),
    ('serviceWorker' in navigator),
  ];

  onMount(() => {
    navigator.serviceWorker.register('/sw.js');
  });
</script>
<div>
  {#if requirements.every(v => v) }
    <Router/>
  {:else}
    Unsupported browser. Please use chrome.
  {/if}
</div>
