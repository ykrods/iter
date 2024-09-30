<script lang="ts">
  import type { Note } from "$src/types";
  import { link, push } from "svelte-spa-history-router";
  import FormatDateTime from "$src/presentations/FormatDateTime.svelte";
  import RstViewer from "$src/presentations/RstViewer.svelte";
  import Paper from "$src/presentations/Paper.svelte";

  let {
    note,
    html,
    url = "",
  } : {
    note: Note
    html: string
    url: string
  } = $props();

  function shrink(content: string) {
    const n = 140;
    const suffix = (n < content.length) ? "..." : "";
    return content.substring(0, n) + suffix;
  }

  function onItemClick(evt) {
    if (evt.target.tagName.toLowerCase() !== "a") {
      push(url);
    }
  }
</script>
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div class="item" onclick={onItemClick}>
  <Paper>
    {#snippet meta()}
      <a class="id" use:link href={url}>ID: { note.id }</a>
      <FormatDateTime value={note.createdAt}/>
    {/snippet}
    <RstViewer {html}/>
  </Paper>
</div>
<style>
  .item {
    margin: 18px;

    & a.id {
      color: var(--sl-color-neutral-400);
    }
    & a.id:hover {
      color: var(--sl-color-primary-800);
    }
  }
</style>
