<script lang="ts">
  import type useAppState from "$src/useAppState.svelte";

  let {
    appState
  }: {
    appState: ReturnType<typeof useAppState>
  } = $props()

  let items = $derived(appState.workspace?.Documents.find({}).fetch() ?? []);
</script>
<div>
  {#if appState.workspace }
    <ul>
      {#each items as item}
        <li>{ item.key }</li>
      {/each}
    </ul>
  {:else}
    permission required <button onclick={() => appState.requestAccessPermission()}>grant</button>
  {/if}
</div>
