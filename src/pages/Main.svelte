<script lang="ts">
  import EnsureWorkspaceAvailable from "$src/layout/EnsureWorkspaceAvailable.svelte";

  import Main from "./main/Main.svelte";
</script>
<EnsureWorkspaceAvailable>
  {#snippet children(workspace)}
    <Main {workspace}></Main>
  {/snippet}
</EnsureWorkspaceAvailable>
