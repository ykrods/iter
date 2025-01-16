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
    children = undefined,
  }: {
    onConfirmed: () => void
    onCanceled?: () => void | undefined
    open: boolean
    label: string
    children?: Snippet
  } = $props();

  function cancelClick() {
    open = false;
    if (onCanceled) {
      onCanceled();
    }
  }
  function okClick() {
    open = false;
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

  {#if children}
    {@render children()}
  {/if}
</SLDialog>
