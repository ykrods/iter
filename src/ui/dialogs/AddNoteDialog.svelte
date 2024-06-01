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

  import RstEditor from "$src/ui/RstEditor.svelte";

  import { addNote } from "$src/lib/note/addNote";


  let {
    open = $bindable(false),
    project,
    onCreate,
  } : {
    open: boolean
    project: Project
    onCreate: (noteId: string) => any
  } = $props();


  let content = $state("");


  async function onSave() {
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
  <RstEditor bind:content></RstEditor>

  {#snippet footer()}
    <SLButton onclick={() => { open = false;}}>Cancel</SLButton>
    <SLButton
      onclick={onSave}
      variant="primary"
      disabled={!isValid()}
    >Create</SLButton>
  {/snippet}
</SLDialog>
