<script lang="ts">
  import Header from "./main/Header.svelte";
  import FileView from "./FileView.svelte";
  import JournalsView from "./JournalsView.svelte";
  import OrderedList from "./OrderedList.svelte";
  import DocView from "./DocView.svelte";
  import AddJournal from "./AddJournal.svelte";

  import { getDB } from "$src/lib/idb";
  import useMainModel from "./useMainModel.svelte";
  import asyncWorkerClient from "$src/lib/asyncWorkerClient";

  const mainModel = useMainModel(
    getDB(),
    asyncWorkerClient(window.navigator.serviceWorker),
  );
  mainModel.setup();

  $effect(() => {
    return () => { mainModel.dispose(); }
  });
</script>
<div>
  <Header
    project={mainModel.project}
    projects={mainModel.projects}
    onOpenNewProject={() => mainModel.openNewProject()}
    onOpenRecentProject={(proj) => mainModel.openRecentProject(proj)}
  ></Header>
  <div class="drawer lg:drawer-open">
    <input type="checkbox" class="drawer-toggle" />
    <div class="drawer-content flex flex-col items-center justify-center">
      {#if mainModel.route.name === "doc" }
        <DocView
          doc={ mainModel.route.doc }
          rst2html={ (content, key) => mainModel.rst2html(content, key) }
          onNavigate={ (key) => mainModel.openDoc(key) }
        ></DocView>
      {:else if mainModel.route.name === "docs" && mainModel.Documents }
        <FileView
          Documents={mainModel.Documents}
          onSelect={(doc) => mainModel.show({ name: "doc", doc })}
        ></FileView>
      {:else if mainModel.route.name === "journals" && mainModel.Documents}
        <JournalsView
          Documents={mainModel.Documents}
          onSelect={(doc) => mainModel.show({ name: "doc", doc })}
          onNavigate={ (key) => mainModel.openDoc(key) }
        ></JournalsView>
      {:else if mainModel.route.name === "decisions" && mainModel.Documents}
        <OrderedList
          Documents={mainModel.Documents}
          onSelect={(doc) => mainModel.show({ name: "doc", doc })}
        ></OrderedList>
      {/if}
    </div>
    <div class="drawer-side">
      <div class="min-h-full w-80 p-4 bg-base-200">
        {#if mainModel.project }
          <ul class="menu text-base-content">
            <li><button onclick={() => mainModel.show({ name: "docs" })}>docs</button></li>
            <li><button onclick={() => mainModel.show({ name: "journals" })}>journals</button></li>
            <li><button onclick={() => mainModel.show({ name: "decisions" })}>decisions</button></li>
          </ul>
          <AddJournal onSave={(content) => mainModel.addJournal(content)}></AddJournal>
        {/if}
      </div>
    </div>
  </div>
</div>
