<script lang="ts">
  import type { Cursor } from "@signaldb/core";
  import type { Shelf, Doc } from "$src/types";

  let {
    shelf,
    getCursor,
    onSelect,
  }: {
    shelf: Shelf
    getCursor: () => Cursor<Doc, Doc>
    onSelect: (doc: Doc) => void
  } = $props()

  let items = $derived(getCursor().fetch());
</script>
<h2>{ shelf.name }</h2>
<ul>
  {#each items as item }
    <li><button onclick={() => onSelect(item)}>{ item.key } { item.title }</button></li>
  {/each}
</ul>
