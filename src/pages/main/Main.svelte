<script lang="ts">
  import type { Shelf } from "$src/types";

  import { link } from "svelte-spa-history-router";
  import CreateDocDialog from "$src/ui/CreateDocDialog.svelte";

  let {
    shelves,
    shelfUrl,
    getOpenCreateDocDialog,
    setOpenCreateDocDialog,
    onSave,
  }: {
    shelves: Shelf[]
    shelfUrl: (shelf: Shelf) => string
    getOpenCreateDocDialog: (shelf: Shelf) => boolean
    setOpenCreateDocDialog: (shelf: Shelf, v: boolean) => void
    onSave: (shelf: Shelf, key: string, content: string) => Promise<any>
  } = $props();
</script>
<main>
  <ul>
    {#each shelves as shelf}
      <li><a use:link href={shelfUrl(shelf)}>{ shelf.name }</a></li>
    {/each}
  </ul>
  {#each shelves as shelf}
    <button onclick={() => setOpenCreateDocDialog(shelf, true)}>{ shelf.name } +</button>
  {/each}
</main>
{#each shelves as shelf}
  <CreateDocDialog
    bind:open={() => getOpenCreateDocDialog(shelf), (v) => setOpenCreateDocDialog(shelf, v)}
    keyInput={shelf.type === "folder"}
    onSave={(key, content) => onSave(shelf, key, content)}
  ></CreateDocDialog>
{/each}
