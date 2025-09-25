<script lang="ts">
  import type { Workspace, Shelf } from "$src/types";

  import EnsureWorkspaceAvailable from "$src/components/EnsureWorkspaceAvailable.svelte";
  import Folder from "./shelf/Folder.svelte";
  import NoteList from "./shelf/NoteList.svelte";
  import SerialList from "./shelf/SerialList.svelte";

  let {
    shelf,
  }: {
    shelf: Shelf
  } = $props()

  function getCursor(workspace: Workspace) {
    return workspace.Documents.find({
        key: new RegExp(`^${shelf.name}/`)
    });
  }
</script>
<EnsureWorkspaceAvailable>
  {#snippet children(workspace)}
    {#if shelf.type === "folder"}
      <Folder
        {shelf}
        getCursor={() => getCursor(workspace)}
        docUrl={(doc) => `/${workspace.project.id}/${doc.key}`}
      ></Folder>
    {/if}
    {#if shelf.type === "note"}
      <NoteList
        {shelf}
        getCursor={() => getCursor(workspace)}
        docUrl={(doc) => `/${workspace.project.id}/${doc.key}`}
      ></NoteList>
    {/if}
    {#if shelf.type === "serial"}
      <SerialList
        {shelf}
        getCursor={() => getCursor(workspace)}
        docUrl={(doc) => `/${workspace.project.id}/${doc.key}`}
      ></SerialList>
    {/if}
  {/snippet}
</EnsureWorkspaceAvailable>
