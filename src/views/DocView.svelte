<script lang="ts">
  import type { Cursor } from "@signaldb/core";
  import type { Doc } from "$src/types";

  import ellipsisHorizontal from "$src/assets/heroicons/24/outline/ellipsis-horizontal.svg";
  import pencil from "$src/assets/heroicons/24/outline/pencil.svg";
  import DocViewer from "$src/ui/DocViewer.svelte";
  import Paper from "$src/ui/presentations/Paper.svelte";
  import FormatDateTime from "$src/ui/presentations/FormatDateTime.svelte";
  import IconButton from "$src/ui/IconButton.svelte";
  import Dropdown from "$src/ui/Dropdown.svelte";

  let {
    docKey,
    getCursor,
    rst2html,
    onNavigate,
    onEditClick,
    onDeleteClick,
  }: {
    docKey: string
    getCursor: (key: string) => Cursor<Doc, Doc>
    rst2html: (content: string, key: string) => Promise<string>
    onNavigate: (key: string) => void
    onEditClick: (doc: Doc) => void
    onDeleteClick: (doc: Doc) => void
  } = $props()

  let menu: HTMLUListElement;

  let doc = $derived(getCursor(docKey));
</script>
<div>
  <!-- check doc if deleted -->
  {#if doc}
    {#await rst2html(doc.content, doc.key) then html}
      <Paper>
        {#snippet meta()}
          <span>ID:{ doc.key }</span>
          <FormatDateTime value={ doc.createdAt }/>
          <IconButton onclick={() => onEditClick(doc)}>
            <img src={pencil} class="size-4" alt="edit icon">
          </IconButton>
          <Dropdown class="dropdown-end w-42" buttonClass="btn-circle btn-ghost">
            {#snippet buttonContent()}
              <img src={ellipsisHorizontal} class="size-4" alt="other menu icon">
            {/snippet}
            {#snippet content(close)}
              <li>
                <button
                  class="text-error"
                  onclick={() => {
                    close();
                    //onDeleteClick(doc);
                  }}
                >Delete</button>
              </li>
            {/snippet}
          </Dropdown>
        {/snippet}
        <DocViewer {html} {onNavigate}/>
      </Paper>
    {/await}
  {/if}
</div>
