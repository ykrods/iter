<script>
  import { Dialog } from 'svelte-mui';
  import { push } from "svelte-spa-history-router";

  import { currentProject } from "../../stores.js";
  import { search } from "../../search.js";

  export let visible = false;
  let searchInput;
  let searchText = "";

  $: resultsPromise = search($currentProject, searchText);

  $: if (searchInput) {
    searchInput.focus();
  }
</script>

<Dialog bind:visible width="600">
  <div slot="title">
    Search:<input class="searchInput" type="text" bind:this={searchInput} bind:value={searchText} />
  </div>
  {#await resultsPromise then results}
    {#if 0 < results.length }
      {#each results as result}
        <a class="row" href={result.url} on:click|preventDefault={() => { push(result.url); visible = false; }}>
          <span class="model">{ result.model }</span>{ result.displayText }
        </a>
      {/each}
    {:else}
      No results.
    {/if}
  {/await}
</Dialog>

<style>
  .searchInput {
    font-size: 1em;
    padding: 0.4em;
    background: transparent;
    width: 50%;
    border: none;
  }
  .searchInput:focus {
    outline: 0;
  }
  a.row {
    display:block;
  }
  a.row:hover {
    color: inherit;
    background-color: #FFE;
  }

  .model {
    border: 1px solid black;
    padding: 3px 5px;
    border-radius: 3px;
    margin-right: 5px;
  }
</style>
