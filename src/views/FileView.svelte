<script lang="ts">
  import type { Doc, Documents as DocumentsType } from "$src/types";

  let {
    Documents,
    onSelect,
  }: {
    Documents: DocumentsType
    onSelect: (doc: Doc) => void
  } = $props()

  let items = $derived(Documents.find({ key: /^docs\// }).fetch());
</script>
<h2>docs</h2>
<ul>
  {#each items as item }
    <li onclick={() => onSelect(item)}>{ item.key }</li>
  {/each}
</ul>
