<script lang="ts">
  import type { Workspace } from "$src/types";

  import { link } from "svelte-spa-history-router";

  let { workspace }: { workspace: Workspace } = $props();

  let items = $derived(workspace.Documents.find({}).fetch());
</script>
<main>
  <ul>
    {#each items as item}
      <li><a use:link href="/{workspace.project.id}/{ item.key }">{ item.key }</li>
    {/each}
  </ul>
</main>
