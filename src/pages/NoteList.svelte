<script>
  import { push, link } from "svelte-spa-history-router";
  import { Button } from "svelte-mui";

  import { dbEvents } from "../stores.js";
  import { Note } from "../models/note.js";

  import AddButton from "../ui/buttons/AddButton.svelte";
  import EditNoteDialog from "../ui/dialogs/EditNoteDialog.svelte";
  import FormatDate from "../presentation/FormatDate.svelte";
  import Paginator from "../ui/Paginator.svelte";

  const pageSize = 20;

  export let project;

  let showAddNoteDialog = false;
  let moved = false;// for item click event

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
<main id="NoteList" class="card">
  <div class="heading">
    <h1>Notes</h1>
    <Paginator bind:page bind:numOfPages />
    <AddButton id="create-note-button" on:click={() => { showAddNoteDialog = true; }} />
  </div>

  {#await notesPromise then notes }
    <div class="items">
      {#each notes as note }
        <div class="item"
          on:mousedown={ () => { moved = false }}
          on:mousemove={ () => { moved = true; }}
          on:mouseup={ () => { if (!moved) { itemDidPush(note) } }}
        >
          <pre>{ note.heading_long }</pre>
          <p class="meta"><FormatDate value={ note.created_at }/></p>
        </div>
      {/each}
    </div>
  {/await}
  <Paginator bind:page bind:numOfPages />
</main>
<EditNoteDialog bind:visible={showAddNoteDialog} />

<style>
  pre {
    font-family: monospace;
    white-space: pre-wrap ;
  }
  .item {
    padding: 10px 0 0 0;
    border-bottom: 1px solid #ddd;
  }
  .item:first-child {
    border-top: 1px solid #ddd;
  }
  .item:last-child {
    margin-bottom: 10px;
  }
  .item:hover {
    background-color: var(--hover-color, #FAFAFA);
  }
  p.meta {
    margin: 15px 0 3px 0;
    text-align: right;
    color: #bbb;
    font-size: 0.9em;
  }
</style>
