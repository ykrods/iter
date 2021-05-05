<script>
  import { push, link, currentURL } from "svelte-spa-history-router";

  import { dbEvents } from "../stores.js";
  import { Note } from "../models/note.js";

  import NoteItem from "../ui/items/NoteItem.svelte";
  import FormatDate from "../presentation/FormatDate.svelte";
  import Paginator from "../ui/Paginator.svelte";

  const pageSize = 20;

  export let project;

  let page = 1;
  let numOfPages = 1;

  let notesPromise = Promise.resolve([]);

  // reload if modified
  $: if ($dbEvents.some((event) => event.model === "Note")
         || $currentURL.searchParams.get("id")
         || page ) {
    refresh();
  }

  async function refresh() {
    numOfPages = Math.ceil((await Note.totalCount(project)) / pageSize);
    if (numOfPages < page) {
      page = 1;
    }
    notesPromise = buildQuery();
  }

  async function buildQuery() {
    const id = $currentURL.searchParams.get("id");
    if (id) {
      return [(await Note.get(project, id))];
    }
    const offset = pageSize * (page - 1);
    return Note.list(project, { limit: 20, offset });
  }
</script>

<svelte:head>
  <title>Notes @ { project.id } | iter</title>
</svelte:head>
<main id="NoteList">
  <Paginator bind:page bind:numOfPages />
  {#await notesPromise then notes }
    {#each notes as note }
      <NoteItem {note}/>
    {/each}
  {/await}
  <Paginator bind:page bind:numOfPages />
</main>
