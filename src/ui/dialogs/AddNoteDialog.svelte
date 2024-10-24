<script lang="ts">
  import type { Project } from "$src/types";

  import {
    SLButton,
    SLDialog,
    SLForm,
    SLIcon,
    SLTextarea,
    SLRadioGroup,
    SLRadioButton,
  } from "$src/ui/shoelace";

  import DocViewer from "$src/presentations/DocViewer.svelte";

  import { addNote } from "$src/lib/note/addNote";
  import { asyncWorkerClient } from "$src/lib/asyncWorkerClient";
  import { HtmlProvider } from "$src/lib/HtmlProvider";


  let {
    open = $bindable(false),
    project,
    onCreate,
  } : {
    open: boolean
    project: Project
    onCreate: (noteId: string) => any
  } = $props();

  const client = asyncWorkerClient(navigator.serviceWorker, Promise);

  let content = $state("");
  let html = $state("");
  let panel = $state("editor");

  $effect(() => {
    return () => { client.close() };
  });

  $effect(() => {
    HtmlProvider(project.db, client).get(content).then(h => { html = h });
  });

  async function onSubmit(evt: SubmitEvent) {
    evt.preventDefault();

    const noteId = await addNote(project.db, content);
    content = "";
    open = false;
    onCreate(noteId);
  }

  function isValid() {
    return 0 < content.length;
  }
</script>
<SLDialog
  bind:open
  label="New note"
>
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

  <SLForm {onSubmit} id="addNoteForm">
    <div class="panel">
      {#if panel !== "preview"}
        <div class="editor" class:hidden={panel === "preview"} >
          <SLTextarea
            resize="auto"
            bind:value={content}
          ></SLTextarea>
        </div>
      {/if}
      {#if panel !== "editor"}
        <div class="preview" class:hidden={panel === "editor"} >
          <DocViewer {html}/>
        </div>
      {/if}
    </div>
  </SLForm>


  {#snippet footer()}
    <SLButton onclick={() => { open = false;}}>Cancel</SLButton>
    <SLButton
      type="submit"
      form="addNoteForm"
      variant="primary"
      disabled={!isValid()}
    >Create</SLButton>
  {/snippet}
</SLDialog>
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
