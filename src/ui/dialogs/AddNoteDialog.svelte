<script lang="ts">
  import type { Project } from "$src/types";

  import {
    SLButton,
    SLDialog,
    SLForm,
    SLTextarea,
  } from "$src/ui/shoelace";

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
  <SLForm {onSubmit} id="addNoteForm">
    <SLTextarea bind:value={content}></SLTextarea>
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
