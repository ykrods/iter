<script lang="ts">
  import type { Project, Note } from "$src/types";

  import RstViewer from "$src/presentations/RstViewer.svelte";

  import { getNote } from "$src/lib/note/getNote";

  let {
    params,
    project
  } : {
    params: Record<string, string>
    project: Project
  } = $props();

  let note: Note | null = $state(null);

  $effect(() => {
    if (params.noteId) {
      load(params.noteId);
    }
  });

  async function load(noteId: string) {
    note = await getNote(project.db, noteId);
  }

</script>
<main id="Note">
  {#if note !== null }
    <p>{ note.id }</p>
    <p>{ note.createdAt }</p>
    <RstViewer rst={ note.content }/>
  {/if}
</main>
