<script lang="ts">
  import EnsureWorkspaceAvailable from "$src/components/EnsureWorkspaceAvailable.svelte";

  import Main from "./main/Main.svelte";
</script>
<EnsureWorkspaceAvailable>
  {#snippet children(workspaceState)}
    <Main
      shelves={workspaceState.shelves}
      shelfUrl={workspaceState.shelfUrl}
      getOpenCreateDocDialog={workspaceState.getOpenCreateDocDialog}
      setOpenCreateDocDialog={workspaceState.setOpenCreateDocDialog}
      onSave={workspaceState.saveDoc}
    ></Main>
  {/snippet}
</EnsureWorkspaceAvailable>
