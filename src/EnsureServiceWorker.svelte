<script lang="ts">
  import type { Snippet } from "svelte";

  let { children } : { children: Snippet } = $props();

  async function registerServiceWorker() {
    if ("serviceWorker" in navigator) {
      try {
        await navigator.serviceWorker.register("/sw.js");
        return true;
      } catch (e) {
        console.error(e);
      }
    }
    return false;
  }
</script>
{#await registerServiceWorker() then result}
  {#if result}
    {@render children()}
  {:else}
    This app requires Service Worker and your browser does not support it.
  {/if}
{/await}
