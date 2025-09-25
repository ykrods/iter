<script lang="ts">
  import type { Doc } from "$src/types";

  import { push } from "svelte-spa-history-router";
  import asyncWorkerClient from "$src/lib/asyncWorkerClient";
  import rewriteHTML from "$src/lib/rewriteHTML";
  import DocViewer from "$src/ui/DocViewer.svelte";
  import Paper from "$src/ui/Paper.svelte";
  import FormatDateTime from "$src/ui/FormatDateTime.svelte";


  let {
    // FIXME: temporary variable for rewriteHTML
    projectId,
    key,
    getCursor,
  }: {
    projectId: string
    key: string
    getCursor: () => Doc
  } = $props()

  let title = $state("")
  let html = $state("")

  let doc = $derived(getCursor());
  const client = asyncWorkerClient(window.navigator.serviceWorker);

  $effect(() => {
    if (doc && doc.content) {
      client.rst2html(doc.content).then((result) => {
        title = (result.title !== "") ? result.title : doc.key;
        html = rewriteHTML(result.html, {
          origin: window.origin,
          project: projectId,
          key,
        });
      });
    }
  });

  $effect(() => {
    return () => client.close();
  });

</script>
<svelte:head>
  <title>{ title }</title>
</svelte:head>
<main>
  {#if html !== ""}
    <Paper>
      {#snippet meta()}
        <span>ID:{ doc.key }</span>
        <FormatDateTime value={ doc.createdAt }/>
      {/snippet}
      <DocViewer {html} onNavigate={(path) => push(path)}></DocViewer>
    </Paper>
  {/if}
</main>
