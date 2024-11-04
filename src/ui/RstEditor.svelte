<script lang="ts">
  import {
    SLIcon,
    SLRadioButton,
    SLRadioGroup,
    SLTextarea,
  } from "$src/ui/shoelace";

  import DocViewer from "$src/presentations/DocViewer.svelte";
  import Paper from "$src/presentations/Paper.svelte";
  import { asyncWorkerClient } from "$src/lib/asyncWorkerClient";
  import { HtmlProvider } from "$src/lib/HtmlProvider";

  let {
    content = $bindable()
  }: { content: string } = $props();

  let panel = $state("editor");
  let html = $state("");

  const client = asyncWorkerClient(navigator.serviceWorker, Promise);


  $effect(() => {
    return () => {
      client.close()
    }
  });

  $effect(() => {
    HtmlProvider(client).rst2html(content).then(h => { html = h });
  });


</script>
<div>
  <SLRadioGroup bind:value={panel}>
    <SLRadioButton value="editor">
      <SLIcon name="pencil" label="editor"></SLIcon>
    </SLRadioButton>
    <SLRadioButton value="sideBySide">
      <SLIcon name="layout-split" label="sideBySide"></SLIcon>
    </SLRadioButton>
    <SLRadioButton value="preview">
      <SLIcon name="code-square" label="preview"></SLIcon>
    </SLRadioButton>
  </SLRadioGroup>

  <div class="panel">
    {#if panel !== "preview"}
      <div class="editor" class:hidden={panel === "preview"} >
        <SLTextarea bind:value={content} resize="auto"></SLTextarea>
      </div>
    {/if}
    {#if panel !== "editor"}
      <div class="preview" class:hidden={panel === "editor"} >
        <Paper>
          <DocViewer {html}/>
        </Paper>
      </div>
    {/if}
  </div>
</div>
<style>
  .panel {
    margin-top: 20px;
    display: flex;
    flex-wrap: nowrap;
    column-gap: 15px;

    &> div {
      overflow-x: clip;
      width: 100%;
      flex-basis: 0;
      flex-grow: 1;
      flex-shrink: 0;

      &.preview {
        min-height: 100px;
      }
    }
  }
</style>
