<script lang="ts">
  import type { Workspace } from "$src/types";

  let { workspace }: { workspace: Workspace } = $props();

  let items = $derived(workspace.Documents.find({}).fetch() ?? []);
</script>
<main>
  <ul>
    {#each items as item}
      <li>{ item.key }</li>
    {/each}
  </ul>
</main>
