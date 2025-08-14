<script lang="ts">
  import Header from "./main/Header.svelte";
  import FolderView from "./FolderView.svelte";
  import NoteListView from "./NoteListView.svelte";
  import SerialListView from "./SerialListView.svelte";
  import DocView from "./DocView.svelte";
  import CreateDocDialog from "./main/CreateDocDialog.svelte";

  import { getDB } from "$src/lib/idb";
  import useMainModel from "./useMainModel.svelte";
  import asyncWorkerClient from "$src/lib/asyncWorkerClient";


  const mainModel = useMainModel(
    getDB(),
    asyncWorkerClient(window.navigator.serviceWorker),
  );
  mainModel.setup();

  let openCreateDocDialogs: Record<string, boolean> = $state({});

  $effect(() => {
    return () => { mainModel.dispose(); }
  });
</script>
<div class="drawer lg:drawer-open bg-base-200">
  <input type="checkbox" class="drawer-toggle" />
  <div class="drawer-content p-2">
    {#if mainModel.route.name === "doc" && mainModel.route.doc }
      <DocView
        doc={ mainModel.route.doc }
        rst2html={ (content, key) => mainModel.rst2html(content, key) }
        onNavigate={ (key) => mainModel.openDoc(key) }
      ></DocView>
    {:else if mainModel.routeShelf?.type === "folder" }
      <FolderView
        shelf={mainModel.routeShelf}
        getCursor={() => mainModel.getCursor() }
        onSelect={(doc) => mainModel.show({ name: "doc", doc })}
      ></FolderView>
    {:else if mainModel.routeShelf?.type === "note" }
      <NoteListView
        shelf={mainModel.routeShelf}
        getCursor={() => mainModel.getCursor() }
        onSelect={(doc) => mainModel.show({ name: "doc", doc })}
        onNavigate={ (key) => mainModel.openDoc(key) }
      ></NoteListView>
    {:else if mainModel.routeShelf?.type === "serial" }
      <SerialListView
        shelf={mainModel.routeShelf}
        getCursor={() => mainModel.getCursor() }
        onSelect={(doc) => mainModel.show({ name: "doc", doc })}
      ></SerialListView>
    {/if}
  </div>
  <div class="drawer-side">
    <div class="min-h-full w-80 p-4">
      <Header
        project={mainModel.project}
        projects={mainModel.projects}
        onOpenNewProject={() => mainModel.openNewProject()}
        onOpenRecentProject={(proj) => mainModel.openRecentProject(proj)}
      ></Header>

      {#if mainModel.project }
        <ul class="menu text-base-content w-auto">
          {#each mainModel.project.shelves as shelf}
            <li class="flex flex-row items-center group">
              <button
                class="flex-1"
                onclick={() => mainModel.show({ name: shelf.name })}
                >{ shelf.name }</button>
              <button
                class="flex-none btn btn-sm btn-ghost opacity-0 group-hover:opacity-100"
                onclick={() => openCreateDocDialogs[shelf.name] = true}
              >+</button>
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  </div>
</div>
{#if mainModel.project}
  {#each mainModel.project.shelves as shelf}
    <CreateDocDialog
      bind:open={() => openCreateDocDialogs[shelf.name] || false, (v) => openCreateDocDialogs[shelf.name] = v}
      {shelf}
      rst2html={(content, key) => mainModel.rst2html(content, key)}
      onSave={(content, key) => mainModel.saveDoc(shelf, content, key)}
      ></CreateDocDialog>
  {/each}
{/if}
