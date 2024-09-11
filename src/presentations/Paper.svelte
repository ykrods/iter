<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    children,
    meta,
  }: {
    children: Snippet
    meta: Snippet
  } = $props();
</script>
<div class="paper">
  <div class="meta">
    {#if meta}
      {@render meta()}
    {/if}
  </div>
  {#if children}
    <div class="content">
      {@render children()}
    </div>
  {/if}
</div>
<style>
  .paper {
    background-color: white;
    box-shadow: 2px 2px 2px 0px rgba(125, 125, 125, 0.1);

    & .meta {
      padding: 10px;
      font-family: monospace;
      font-size: 0.9em;
      color: var(--sl-color-neutral-400);
      text-align: right;
    }

    & .content {
      padding: 0px 28px 28px 28px;
    }
  }
</style>
