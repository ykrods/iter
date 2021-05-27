<script>
  import { Dialog, Button } from 'svelte-mui';
  import { push } from "svelte-spa-history-router";

  import Times from "@fortawesome/fontawesome-free/svgs/solid/times.svg";

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
  <div slot="title" class="title">
    Search:
    <input class="searchInput" type="text" bind:this={searchInput} bind:value={searchText} />
    {#if searchText !== "" }
      <Button on:click={() => { searchText = "";}}>clear</Button>
    {/if}
    <Button dense icon on:click={() => { visible = false; }}>
      <svelte:component this={Times}/>
    </Button>
  </div>
  <div class="result">
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
  </div>
</Dialog>

<style>
  .title {
    display: flex;
    align-items: center;
  }
  .searchInput {
    flex: 1;
    font-size: 1em;
    padding: 0.4em;
    background: transparent;
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
  .result {
    min-height: 60px;
  }
  .model {
    display: inline-block;
    border: 1px solid black;
    padding: 2px 5px;
    border-radius: 3px;
    margin: 1px 5px 0 0;
  }
</style>
