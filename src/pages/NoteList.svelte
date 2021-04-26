<script>
  import { push, link } from "svelte-spa-history-router";

  import { Note } from "../models/note.js";
  import FormatDate from "../presentation/FormatDate.svelte";

  export let project;
  let notesPromise = Promise.resolve([]);

  $: notesPromise = Note.list(project);
</script>

<svelte:head>
  <title>Notes @ { project.id } | iter</title>
</svelte:head>
<main id="NoteList">
  {#await notesPromise then notes }
    {#each notes as note }
      <div class="card item">
        <pre>{ note.body }</pre>
      </div>
    {/each}
  {/await}
</main>

<style>
.item { margin: 10px 0; }
pre { white-space: pre-wrap ; }

</style>
