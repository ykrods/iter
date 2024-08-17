<script lang="ts">
  import type { Project } from "$src/types";

  import { link } from "svelte-spa-history-router";

  import { liveQuery } from "dexie";

  let { project } : { project: Project } = $props()

  let notes = $derived(liveQuery(() => project.db.notes.toArray()));
</script>
<main id="Home">
  Home
  {#each $notes as note}
    <div><a use:link href={ project.url(`/notes/${note.id}`) }>{ note.id }</a></div>
  {/each}
</main>
