<script lang="ts">
  import type { IterIDB } from "$src/types";

  import { useMainModel } from "./main/useMainModel.svelte.ts";
  import { getDB } from "$src/lib/idb";

  import DocumentList from "./views/DocumentList.svelte";

  const idb: IterIDB = getDB();
  const mainModel = useMainModel(idb)

  mainModel.setup()
</script>
<div>
  <button onclick={() => mainModel.openNewProject()}>open</button>
  <ul>
    {#each mainModel.projects as proj }
      <li onclick={() => mainModel.openRecentProject(proj)}>{ proj.id }</li>
    {/each}
  </ul>
  {#if mainModel.project}
    { mainModel.project.id }
    <DocumentList project={mainModel.project}/>
  {/if}
</div>
