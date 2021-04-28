<script>
  import { push, link } from "svelte-spa-history-router";

  import { dbEvents } from "../stores.js";
  import { Note } from "../models/note.js";

  import NoteItem from "../ui/items/NoteItem.svelte";
  import FormatDate from "../presentation/FormatDate.svelte";

  export let project;
  let notesPromise = Note.list(project);

  // reload if modified
  $: if ($dbEvents.some((event) => event.model === "Note")) {
    notesPromise = Note.list(project);
  }
</script>

<svelte:head>
  <title>Notes @ { project.id } | iter</title>
</svelte:head>
<main id="NoteList">
  {#await notesPromise then notes }
    {#each notes as note }
      <NoteItem {note}/>
    {/each}
  {/await}
</main>
