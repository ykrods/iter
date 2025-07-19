<script lang="ts">
  import AddJournal from "./AddJournal.svelte";

  import { getDB } from "$src/lib/idb";
  import useMainModel from "./useMainModel.svelte";

  const mainModel = useMainModel(getDB());
  mainModel.setup();
</script>
<div>
  <button onclick={() => mainModel.openNewProject()}>open</button>
  <ul>
    {#each mainModel.projects as proj }
      <li onclick={() => mainModel.openRecentProject(proj)}>{ proj.id }</li>
    {/each}
  </ul>
  {#if mainModel.project && mainModel.Documents }
    { mainModel.project.id }
    <AddJournal onSave={(content) => mainModel.addJournal(content)}/>
  {/if}
</div>
