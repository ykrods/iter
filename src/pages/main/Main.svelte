<script lang="ts">
  import type { Workspace } from "$src/types";

  import { link } from "svelte-spa-history-router";

  import CreateDocDialog from "$src/ui/CreateDocDialog.svelte";
  import useMainModel from "./useMainModel.svelte";
  import asyncWorkerClient from "$src/lib/asyncWorkerClient";

  let { workspace }: { workspace: Workspace } = $props();


  const mainModel = useMainModel(
    workspace,
    asyncWorkerClient(window.navigator.serviceWorker),
  );

  let openCreateDocDialogs: Record<string, boolean> = $state({});

  let items = $derived(workspace.Documents.find({}).fetch());

</script>
<main>
  <ul>
    {#each items as item}
      <li><a use:link href="/{workspace.project.id}/{ item.key }">{ item.key } {item.title}</a></li>
    {/each}
  </ul>
  {#each mainModel.shelves as shelf}
    <button onclick={() => { openCreateDocDialogs[shelf.name] = true }}>{ shelf.name } +</button>
  {/each}
</main>
{#each mainModel.shelves as shelf}
  <CreateDocDialog
    bind:open={() => openCreateDocDialogs[shelf.name] || false, (v) => openCreateDocDialogs[shelf.name] = v}
    keyInput={shelf.type === "folder"}
    onSave={(key, content) => mainModel.save(shelf, key, content)}
  ></CreateDocDialog>
{/each}
