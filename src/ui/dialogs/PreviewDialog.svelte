<script lang="ts">
  import type { Project } from "$src/types";

  import { SLButton, SLDialog } from "$src/ui/shoelace";

  import RstViewer from "$src/presentations/RstViewer.svelte";

  import { asyncWorkerClient } from "$src/lib/asyncWorkerClient";
  import { HtmlProvider } from "$src/lib/HtmlProvider";

  const client = asyncWorkerClient(navigator.serviceWorker, Promise);


  let {
    open = $bindable(false),
    rst,
    project,
  } : {
    open: boolean
    rst: string
    project: Project
  } = $props();

  let html = $state("");

  $effect(() => {
    HtmlProvider(project.db, client).get(rst).then(h => { html = h });

    return () => {
      client.close();
    }
  });
</script>
<SLDialog
  bind:open
  label="Preview"
>
  <RstViewer {html}/>

  {#snippet footer()}
    <SLButton
      variant="primary"
      onclick={() => { open = false; }}
    >Close</SLButton>
  {/snippet}
</SLDialog>
