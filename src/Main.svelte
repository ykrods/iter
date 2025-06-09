<script lang="ts">
  import type { IterIDB } from "$src/types";

  import { useMainModel } from "./main/useMainModel.svelte.ts";
  import { getDB } from "$src/lib/idb";


  const idb: IterIDB = getDB();
  const mainModel = useMainModel(idb)

  // WIP
  let documents = $derived(mainModel.Documents.find({}).fetch());

  mainModel.setup()
</script>
<div>
  { mainModel.project?.id }
  <button onclick={() => mainModel.openProject()}>open</button>
  <ul>
    {#each mainModel.projects as proj }
      <li onclick={() => mainModel.openRecentProject(proj)}>{ proj.id }</li>
    {/each}
  </ul>
  <h2>docs</h2>
  <ul>
    {#each documents as document}
      <li><a href="" onclick={e => { e.preventDefault(); doc = document; }}>{ document.key }</a></li>
    {/each}
  </ul>
</div>
