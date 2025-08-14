<script lang="ts">
  import type { Shelf } from "$src/types";

  import Dialog from "$src/ui/Dialog.svelte";
  import RstEditor from "$src/ui/RstEditor.svelte";

  let {
    open = $bindable(false),
    shelf,
    rst2html,
    onSave,
  }: {
    open: boolean
    shelf: Shelf
    rst2html: (content: string, key: string) => Promise<string>
    onSave: (content: string, key: string) => void
  } = $props();

  let key = $state("")
  let title = $state("")
  let content = $state("")

  let preview = $state(false)
  let formId = $derived(`create-doc-form-${shelf.name}`);

  function onSubmit(evt: SubmitEvent) {
    evt.preventDefault();
    save();
  }

  function save() {
    if (content !== "") {
      onSave(content, key)
      content = "";
      open = false;
    }
  }
</script>
<Dialog bind:open={open} title={`Add ${shelf.name}`}>
  <form id={formId} onsubmit={onSubmit}>
    {#if shelf.type === "folder"}
      <fieldset class="fieldset">
        <legend class="fieldset-legend">key</legend>
        <label class="input validator">
          <span class="label">{ shelf.name }/</span>
          <input
            type="text"
            bind:value={key}
            required
            pattern="^(?!.*\./)\S+$"
          />
          <span class="label">.rst</span>
        </label>
      </fieldset>
    {/if}
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
