<script lang="ts">
  import FileView from "./FileView.svelte";
  import JournalsView from "./JournalsView.svelte";
  import OrderedList from "./OrderedList.svelte";
  import DocView from "./DocView.svelte";
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
  {#if mainModel.viewType === "doc"}
    <DocView doc={ mainModel.viewArgs.doc }/>
  {/if}
  {#if mainModel.project && mainModel.Documents }
    { mainModel.project.id }
    <AddJournal onSave={(content) => mainModel.addJournal(content)}/>
    <FileView
      Documents={mainModel.Documents}
      onSelect={(doc) => mainModel.show("doc", { doc })}
    />
    <JournalsView
      Documents={mainModel.Documents}
      onSelect={(doc) => mainModel.show("doc", { doc })}
    />
    <OrderedList
      Documents={mainModel.Documents}
      onSelect={(doc) => mainModel.show("doc", { doc })}
    />
  {/if}
</div>
