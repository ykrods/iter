<script lang="ts">
  import type { Shelf, Documents as DocumentsType } from "$src/types";

  import EnsureWorkspaceAvailable from "$src/components/EnsureWorkspaceAvailable.svelte";
  import Folder from "./shelf/Folder.svelte";
  import NoteList from "./shelf/NoteList.svelte";
  import SerialList from "./shelf/SerialList.svelte";

  let {
    shelf,
  }: {
    shelf: Shelf
  } = $props()

  function getCursor(Documents: DocumentsType) {
    return Documents.find({
        key: new RegExp(`^${shelf.name}/`)
    });
  }
</script>
<EnsureWorkspaceAvailable>
  {#snippet children(workspaceState)}
    {#if shelf.type === "folder"}
      <Folder
        {shelf}
        getCursor={() => getCursor(workspaceState.Documents)}
        docUrl={workspaceState.docUrl}
      ></Folder>
    {/if}
    {#if shelf.type === "note"}
      <NoteList
        {shelf}
        getCursor={() => getCursor(workspaceState.Documents)}
        docUrl={workspaceState.docUrl}
      ></NoteList>
    {/if}
    {#if shelf.type === "serial"}
      <SerialList
        {shelf}
        getCursor={() => getCursor(workspaceState.Documents)}
        docUrl={workspaceState.docUrl}
      ></SerialList>
    {/if}
  {/snippet}
</EnsureWorkspaceAvailable>
