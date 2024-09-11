<script lang="ts">
  import { SLButton, SLDialog } from "$src/ui/shoelace";

  import RstViewer from "$src/presentations/RstViewer.svelte";

  let {
    open = $bindable(false),
    rst,
  } : {
    open: boolean
    rst: string
  } = $props();
</script>
<SLDialog
  bind:open
  label="Preview"
>
  <RstViewer {rst}/>

  {#snippet footer()}
    <SLButton
      variant="primary"
      onclick={() => { open = false; }}
    >Close</SLButton>
  {/snippet}
</SLDialog>
