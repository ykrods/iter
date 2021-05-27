<script>
  import { link } from 'svelte-spa-history-router';

  import { makeBreadCrumbs } from "./libs/makeBreadCrumbs.js";

  export let path = '';

  export let project;

  $: breadCrumbs = makeBreadCrumbs(project, path);
</script>
<div class="breadcrumb">
  {#each breadCrumbs as bs, i}
    {#if 0 < i }
      <span class="separator">/</span>
    {/if}
    {#if bs.link }
      <a use:link href="{bs.link}">{bs.name}</a>
    {:else}
      {bs.name}
    {/if}
  {/each}
</div>

<style>
.separator {
  padding: 0 3px 0 6px;
}
</style>
