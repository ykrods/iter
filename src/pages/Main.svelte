<script lang="ts">
  import type { Project, Doc } from "$src/types";

  import EnsureAccessGranted from "./main/EnsureAccessGranted.svelte"
  import { asyncWorkerClient } from "$src/lib/asyncWorkerClient";
  import rewriteHTML from "$src/lib/rewriteHTML";
  import Documents from "$src/lib/doc/Documents";
  import createSyncManager from "$src/lib/syncManager";

  let { project }: { project: Project } = $props()

  const client = asyncWorkerClient(navigator.serviceWorker);

  const syncManager = createSyncManager(project.id, project.handle);
  syncManager.addCollection(Documents, {
    name: "documents",
  });
  syncManager.syncAll()

  let doc: Doc | undefined = $state();
  let html: string = $state("")
  let documents = $derived(Documents.find({}).fetch());

  $effect(() => {
    return () => client.close();
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
<EnsureAccessGranted handle={project.handle}>
  <h2>docs</h2>
  <ul>
  {#each documents as document}
    <li><a href="" onclick={e => { e.preventDefault(); doc = document; }}>{ document.key }</a></li>
  {/each}
  </ul>
  <h2>viewer</h2>
  <div>
    {#if html !== ""}
      {@html html}
    {/if}
  </div>
</EnsureAccessGranted>
