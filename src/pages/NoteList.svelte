<script>
  import { push, link } from "svelte-spa-history-router";
  import { Button } from "svelte-mui";

  import { dbEvents } from "../stores.js";
  import { Note } from "../models/note.js";

  import FormatDate from "../presentation/FormatDate.svelte";
  import Paginator from "../ui/Paginator.svelte";

  const pageSize = 20;

  export let project;

  let page = 0;
  let numOfPages = 0;

  let notesPromise = Promise.resolve([]);

  let needsToReload = true;

  $: if ($dbEvents.some((event) => event.model === "Note")) {
    needsToReload = true;
  }

  $: if (page) {
    needsToReload = true;
  }

  $: if (needsToReload) {
    reload();
  }

  async function reload() {
    numOfPages = Math.ceil((await Note.totalCount(project)) / pageSize);

    if (numOfPages === 0) {
      page = 0;
      return;
    }

    if (page === 0 || numOfPages < page) {
      page = 1;
    }

    const offset = pageSize * (page - 1);
    notesPromise = Note.list(project, { limit: pageSize, offset });
    notesPromise.then(() => { needsToReload = false; });
  }

  function itemDidPush(note) {
    push(project.url(`/notes/${note.id}`));
  }
</script>

<svelte:head>
  <title>Notes @ { project.id } | iter</title>
</svelte:head>
<main id="NoteList">
  <h1>Notes</h1>
  <Paginator bind:page bind:numOfPages />
  {#await notesPromise then notes }
    {#each notes as note }
      <div class="card item">
        <pre>{ note.heading_long }</pre>
        <div class="area-button" on:click={ itemDidPush(note) }>
          く
        </div>
      </div>
      <p class="meta">created at <FormatDate value={ note.created_at }/></p>
    {/each}
  {/await}
  <Paginator bind:page bind:numOfPages />
</main>

<style>
  pre { white-space: pre-wrap ; }
  .item {
    display: flex;
    margin: 10px 0 0 0;
  }
  p.meta {
    margin: 0;
    text-align: right;
  }
  .area-button:hover {
    background-color: lightgray;
  }
</style>
