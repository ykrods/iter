<script lang="ts">
  import type { Cursor } from "@signaldb/core";
  import type { Shelf, Doc } from "$src/types";

  import { link } from "svelte-spa-history-router";

  let {
    shelf,
    getCursor,
    docUrl,
  }: {
    shelf: Shelf
    getCursor: () => Cursor<Doc, Doc>
    docUrl: (doc: Doc) => string
  } = $props();

  let items = $derived(getCursor().fetch());
</script>
<main>
  <h2>{ shelf.name }</h2>
  <ul>
    {#each items as item}
      <li><a use:link href={docUrl(item)}>{ item.key } { item.title }</a></li>
    {/each}
  </ul>
</main>
