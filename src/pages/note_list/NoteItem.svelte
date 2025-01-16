<script lang="ts">
  import type { Note } from "$src/types";

  import { link, push } from "svelte-spa-history-router";

  import FormatDateTime from "$src/presentations/FormatDateTime.svelte";
  import DocViewer from "$src/presentations/DocViewer.svelte";
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

  function onItemClick(evt: Event) {
    if ((evt.target as HTMLElement).tagName.toLowerCase() !== 'a') {
      push(url);
    }
  }
</script>
<!-- Ignore warnings because there is an accessibility-appropriate anchor tag inside this -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="item" onclick={onItemClick}>
  <Paper>
    {#snippet meta()}
      <a class="id" use:link href={url}>ID:{ note.id }</a>
      <FormatDateTime value={note.createdAt}/>
    {/snippet}
    <DocViewer {html}/>
  </Paper>
</div>
<style>
  .item {
    border: 1px solid var(--bg-color);
    border-radius: 8px;

    & a.id {
      color: var(--sl-color-neutral-400);
    }
    & a.id:hover {
      color: var(--sl-color-primary-800);
    }

    &:hover {
      background-color: var(--sl-color-primary-50);
      border-color: var(--sl-color-primary-300);
      cursor: pointer;
    }
  }
</style>
