<script>
  import { Button } from "svelte-mui";
  import AngleRight from "@fortawesome/fontawesome-free/svgs/solid/angle-right.svg";
  import AngleLeft from "@fortawesome/fontawesome-free/svgs/solid/angle-left.svg";

  export let page;
  export let numOfPages;
</script>

{#if 0 < page && 0 < numOfPages }
  <div class="paginator">
    <span class="button-space">
      {#if 1 < page }
        <Button dense icon on:click={ () => { page--; }}>
          <svelte:component this={AngleLeft}/>
        </Button>
      {/if}
    </span>
    { page } / { numOfPages } Page
    <span class="button-space">
      {#if page < numOfPages }
        <Button dense icon on:click={ () => { page++; }}>
          <svelte:component this={AngleRight}/>
        </Button>
      {/if}
    </span>
  </div>
{/if}

<style>
  .paginator {
    text-align: center;
    display: flex;
    align-items: baseline;
    justify-content: center;
  }
  .button-space {
    width: 48px;
  }
</style>
