<script lang="ts">
  import type { Doc, Documents as DocumentsType } from "$src/types";

  let {
    Documents,
    onSelect,
  }: {
    Documents: DocumentsType
    onSelect: (doc: Doc) => void
  } = $props()

  let items = $derived(Documents.find({ key: /^decisions\// }).fetch());
</script>
<h2>decisions</h2>
<ul>
  {#each items as item }
    <li><button onclick={() => onSelect(item)}>{ item.key } { item.title }</button></li>
  {/each}
</ul>
