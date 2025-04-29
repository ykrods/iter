<script lang="ts">
  import type { Snippet } from "svelte";

  let { children }: { children: Snippet } = $props();

  const available = (typeof window.showDirectoryPicker === 'function');
</script>
{#if available}
  {@render children()}
{:else}
  Unsupported browser. Please use chrome.
{/if}
