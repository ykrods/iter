<script lang="ts">
  import type { Project, Doc } from "$src/types";

  import EnsureAccessGranted from "./main/EnsureAccessGranted.svelte"
  import { asyncWorkerClient } from "$src/lib/asyncWorkerClient";
  import rewriteHTML from "$src/lib/rewriteHTML";
  import Documents from "$src/lib/doc/Documents";
  import createSyncManager from "$src/lib/syncManager";

  import DocViewer from "$src/ui/DocViewer.svelte";

  let { project }: { project: Project } = $props()

  const client = asyncWorkerClient(navigator.serviceWorker);

  const syncManager = createSyncManager(project.id, project.handle);
  syncManager.addCollection(Documents, {
    name: "documents",
  });

  let doc: Doc | undefined = $state();
  let html: string = $state("")
  let documents = $derived(Documents.find({}).fetch());

  $effect(() => {
    return () => {
      client.close();
      Documents.removeAllListeners();
    }
  });

  $effect(() => {
    if (doc) {
      client.rst2html(doc.content).then((r) => {
        const key = "docs/foo.rst";
        const origin = window.location.origin;
        html = rewriteHTML(r, { origin, key, project: project.id })
      });
    }
  });

</script>
<EnsureAccessGranted
  handle={project.handle}
  onGranted={() => syncManager.syncAll() }
>
  <div class="flex">
    <div class="sidebar">
      <h2>docs</h2>
      <ul>
        {#each documents as document}
          <li><a href="" onclick={e => { e.preventDefault(); doc = document; }}>{ document.key }</a></li>
        {/each}
      </ul>
    </div>
    <div class="main">
      <h2>viewer</h2>
      <div>
        {#if html !== ""}
          <DocViewer {html} onNavigate={url => console.log(url)} />
        {/if}
      </div>
    </div>
  </div>
</EnsureAccessGranted>
<style>
  .flex {
    display: flex;

    & .sidebar {
      width: 200px;
      background-color: lightgray;
    }

    & .main {
      flex: 1;
    }
  }
</style>
