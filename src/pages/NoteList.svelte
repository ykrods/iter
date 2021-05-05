<script>
  import { push, link, currentURL } from "svelte-spa-history-router";

  import { dbEvents } from "../stores.js";
  import { Note } from "../models/note.js";

  import NoteItem from "../ui/items/NoteItem.svelte";
  import FormatDate from "../presentation/FormatDate.svelte";

  export let project;
  let notesPromise = buildQuery();

  // reload if modified
  $: if ($dbEvents.some((event) => event.model === "Note")
         || $currentURL.searchParams.get("id")
         || $currentURL.searchParams.get("offset")) {
    notesPromise = buildQuery();
  }

  async function buildQuery() {
    const id = $currentURL.searchParams.get("id");
    if (id) {
      return [(await Note.get(project, id))];
    }
    return Note.list(project, { limit: 20 });
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
