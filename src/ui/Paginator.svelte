<script>
  export let page;
  export let numOfPages;
</script>

{#if 0 < page && 0 < numOfPages }
  <div class="paginator">
    {#if 1 < page }
      <a on:click={ () => { page--; }}>Previous</a>
    {/if}
    { page } / { numOfPages } Page
    {#if page < numOfPages }
      <a on:click={ () => { page++; }}>Next</a>
    {/if}
  </div>
{/if}

<style>
  .paginator {
    text-align: center;
  }
</style>
