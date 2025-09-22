<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    children,
    path,
  } : {
    children: Snippet
    path: string
  } = $props();

  async function registerServiceWorker() {
    if ("serviceWorker" in navigator) {
      try {
        await navigator.serviceWorker.register(path);
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
    Service worker is not available.
  {/if}
{/await}
