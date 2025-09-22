<script lang="ts">
  import type { Snippet } from "svelte";
  import type useAppState from "$src/useAppState.svelte";
  import type { Workspace } from "$src/types";

  import { getContext } from "svelte";

  const appState = getContext<ReturnType<typeof useAppState>>("appState");

  let {
    children,
  }: {
    children: Snippet<[Workspace]>
  } = $props();
</script>
<div>
  {#if appState.workspace }
    {@render children(appState.workspace)}
  {:else}
    permission required <button onclick={() => appState.requestAccessPermission()}>grant</button>
  {/if}
</div>
