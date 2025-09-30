<script lang="ts">
  import type { Snippet } from "svelte";
  import type { AppState, WorkspaceState } from "$src/types";

  import { getContext } from "svelte";

  const appState = getContext<AppState>("appState");

  let {
    children,
  }: {
    children: Snippet<[WorkspaceState]>
  } = $props();
</script>
<div>
  {#if appState.workspaceState }
    {@render children(appState.workspaceState)}
  {:else}
    permission required <button onclick={() => appState.requestAccessPermission()}>grant</button>
  {/if}
</div>
