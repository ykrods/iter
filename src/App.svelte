<script lang="ts">
  import Router from "./Router.svelte";

  import { asyncWorkerClient } from "$src/worker/client.js";

  const serviceWorkerAvailable = ("serviceWorker" in navigator);

  async function registerServiceWorker() {
    if (serviceWorkerAvailable) {
      try {
        await navigator.serviceWorker.register("/sw.js");
      } catch (e) {
        console.error(e);
      }
    }
    await navigator.serviceWorker.ready;


    const client = asyncWorkerClient(navigator.serviceWorker);
    const html = await client.rst2html("===\nff\n===\n* foo");
    console.log(html);
  }

  $effect(() => {
    registerServiceWorker();
  });
</script>
{#if serviceWorkerAvailable }
  <Router />
{:else}
  This app requires Service Worker and your browser does not support it.
{/if}
