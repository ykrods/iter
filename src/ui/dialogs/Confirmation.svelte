<script lang="ts">
  import type { Snippet } from "svelte";

  import {
    SLButton,
    SLDialog,
  } from "$src/ui/shoelace";

  let {
    onConfirmed,
    onCanceled,
    open = $bindable(false),
    label = "",
    children
  }: {
    onConfirmed: () => void
    onCanceled: () => void
    open: boolean
    label: string
    children: Snipped
  } = $props();

  let hideRequest = $state(false);

  function cancelClick() {
    hideRequest = true
    if (onCanceled) {
      onCanceled();
    }
  }
  function okClick() {
    hideRequest = true;
    if (onConfirmed) {
      onConfirmed();
    }
  }
</script>
<SLDialog
  bind:open
  {label}
>
  {#snippet footer()}
    <SLButton onclick={cancelClick}>Cancel</SLButton>
    <SLButton
      variant="primary"
      onclick={okClick}
    >OK</SLButton>
  {/snippet}
</SLDialog>
