<script lang="ts">
  import type { Doc, Updates } from "$src/types";

  import {
    SLButton,
    SLDialog,
    SLSwitch,
    SLTextarea,
  } from "$src/ui/shoelace";
  import DocViewer from "./DocViewer.svelte";


  let {
    open = $bindable(false),
    doc,
    rst2html,
    onSave,
  }: {
    open: boolean
    doc: Doc
    rst2html: (content: string) => Promise<string>
    onSave: (doc: Doc, updates: Updates<Doc>) => void
  } = $props();

  let content = $state("");
  let preview = $state(false);
  let html = $state("");

  $effect(() => {
    if (doc) {
      content = doc.content;
    }
  });

  $effect(() => {
    if (content !== "") {
      rst2html(content).then(h => html = h);
    }
  });

  function onSaveClick() {
    if (content !== doc.content) {
      // TODO: updated toka title はどのタイミングで入れるのか
      onSave(doc, { content })
      reset()
    }
  }

  function reset() {
    content = "";
    preview = false;
    html = "";
    open = false;
  }
</script>
<SLDialog
  bind:open
  label="edit {doc?.key}"
>
  <SLSwitch
    sl-slot="footer"
    bind:checked={preview}
    style="margin-right:10px;"
  >preview</SLSwitch>
  <SLButton sl-slot="footer" onclick={() => open = false }>Cancel</SLButton>
  <SLButton
    sl-slot="footer"
    variant="primary"
    onclick={onSaveClick}
  >save</SLButton>
  {#if preview}
    <DocViewer {html} onNavigate={() => undefined}></DocViewer>
  {:else}
    <SLTextarea bind:value={content} resize="auto"></SLTextarea>
  {/if}
</SLDialog>
