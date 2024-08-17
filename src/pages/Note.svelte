<script lang="ts">
  import type { Project } from "$src/types";

  import RstViewer from "$src/presentations/RstViewer.svelte";

  import { getNote } from "$src/lib/note/getNote";

  let {
    params,
    project
  } : {
    params: Recort<string, string>
    project: Project
  } = $props();

  let note: Note = $state(null);

  $effect(() => {
    if (params.noteId) {
      load(params.noteId);
    }
  });

  async function load() {
    note = await getNote(project.db, params.noteId);
  }

</script>
<main id="Note">
  {#if note !== null }
    <p>{ note.id }</p>
    <p>{ note.createdAt }</p>
    <RstViewer rst={ note.content }/>
  {/if}
</main>
