<script lang="ts">
  import type { Doc } from "$src/types";

  import DocViewer from "$src/ui/DocViewer.svelte";
  import Paper from "$src/ui/presentations/Paper.svelte";
  import FormatDateTime from "$src/ui/presentations/FormatDateTime.svelte";

  let {
    doc,
    rst2html,
    onNavigate,
  }: {
    doc: Doc
    rst2html: (content: string, key: string) => Promise<string>
    onNavigate: (key: string) => void
  } = $props()

</script>
<div>
  {#await rst2html(doc.content, doc.key) then html}
    <Paper>
      {#snippet meta()}
        <span>ID:{ doc.key }</span>
        <FormatDateTime value={ doc.createdAt }/>
      {/snippet}
      <DocViewer {html} {onNavigate}/>
    </Paper>
  {/await}
</div>
