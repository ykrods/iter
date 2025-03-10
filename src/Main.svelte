<script lang="ts">
  import type { Project, Doc } from "$src/types";

  import DocViewer from "$src/views/DocViewer.svelte";
  import { buildDocumentDB } from "$src/lib/documentDB";

  let { project }: { project: Project } = $props();

  let documentDB = $state();
  let doc: Doc | undefined = $state();

  function openDoc(evt: Event, _doc: Doc) {
    doc = _doc;
    evt.preventDefault();
  }

  $effect(() => {
    buildDocumentDB(project.handle).then(db => documentDB = db);
  });
</script>
<div>
  <div class="nav">{ project.id }</div>
  <div class="flex">
    <div class="side">
      <h2>docs</h2>
      <ul>
        {#each documentDB?.docs as doc}
          <li><a onclick={(e) => openDoc(e, doc)} href="/{ doc.key }">{ doc.key }</a></li>
        {/each}
      </ul>
      <h2>decisions</h2>
      <ul>
        {#each documentDB?.decisions as doc}
          <li><a onclick={(e) => openDoc(e, doc)} href="/{ doc.key }">{ doc.key }</a></li>
        {/each}
      </ul>
      <h2>journals</h2>
      <ul>
        {#each documentDB?.journals as doc}
          <li><a onclick={(e) => openDoc(e, doc)} href="/{ doc.key }">{ doc.key }</a></li>
        {/each}
      </ul>
    </div>
    <div>
      {#if doc}
        <DocViewer {doc}/>
      {/if}
    </div>
  </div>
</div>
<style>
  .nav {
    color: white;
    background-color: #333;
  }
  .flex {
    width: 100%;
    display: flex;

    & .side {
      width: 300px;
    }
  }
</style>
