<script lang="ts">
  import type { Shelf, Doc } from "$src/types";

  import Dialog from "$src/ui/Dialog.svelte";
  import RstEditor from "$src/ui/RstEditor.svelte";

  let {
    doc,
    open = $bindable(false),
    rst2html,
    onSave,
  }: {
    doc: Doc
    open: boolean
    rst2html: (content: string, key: string) => Promise<string>
    onSave: (doc: Doc, updates: Record<string, any>) => void
  } = $props();

  let key = $state("")
  let content = $state("");
  let shelf = $derived({ type: "", name: "foo" });
  let preview = $state(false)
  const formId = "edit-doc-form";

  $effect(() => {
    key = doc.key;
    content = doc.content;
  });

  function onSubmit(evt: SubmitEvent) {
    evt.preventDefault();
    save();
  }

  function save() {
    if (content !== doc.content) {
      const updates = { content };
      onSave(doc, updates);
      key = "";
      content = "";
      open = false;
    }
  }
</script>
<Dialog bind:open={open} title={`Edit ${doc.key}`}>
  <form id={formId} onsubmit={onSubmit}>
    <RstEditor {rst2html} {shelf} bind:content {preview}/>
  </form>
  {#snippet action() }
    <div class="mr-auto">
      <label class="label">
        <input type="checkbox" bind:checked={preview} class="toggle" />
        preview
      </label>
    </div>
    <form method="dialog">
      <button class="btn">Cancel</button>
    </form>
    <button type="submit" form={formId} class="btn">Save</button>
  {/snippet}
</Dialog>
