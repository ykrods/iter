<script>
  import { liveQuery } from "dexie";
  import { setContext } from "svelte";

  import Layout from "../layouts/Layout.svelte";
  import FormatDateTime from "../presentations/FormatDateTime.svelte";

  import { contextKey } from "../models/project.js";

  export let project;

  setContext(contextKey, {
    getProject: () => project,
  });

  let moved = false;// for item click event

  let journals = liveQuery(async () => {
    return await project.db.journals.reverse().limit(10).sortBy("id");
  });

  function itemDidPush(journal) {

  }
</script>
<svelte:head>
  <title>journals @ { project.id } | iter</title>
</svelte:head>
<Layout>
  {#each ($journals || []) as journal}
    <div class="item"
      on:mousedown={ () => { moved = false }}
      on:mousemove={ () => { moved = true; }}
      on:mouseup={ () => { if (!moved) { itemDidPush(journal) } }}
        >
      <pre>{ journal.heading_long }</pre>
      <p class="meta"><FormatDateTime value={ journal.created_at }/></p>
    </div>
  {/each}
</Layout>
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
  .item > .meta {
    margin: 15px 0 3px 0;
    text-align: right;
    color: #bbb;
    font-size: 0.9em;
  }
</style>
