<script lang="ts">
  import type { Snippet } from "svelte";

  import {
    SLButton,
    SLDialog,
  } from "$src/ui/shoelace";


  let {
    open = $bindable(false),
    label = "",
    onConfirm,
    onCancel,
    confirmText = "confirm",
    children = undefined,
  }: {
    open: boolean
    label?: string
    onConfirm?: () => void
    onCancel?: () => void
    confirmText?: string
    children?: Snippet
  } = $props();

  function onCancelClick() {
    open = false;
    onCancel?.();
  }
  function onConfirmClick() {
    open = false;
    onConfirm?.();
  }
</script>
<SLDialog
  bind:open
  {label}
>
  <SLButton sl-slot="footer" onclick={onCancelClick}>Cancel</SLButton>
  <SLButton
    sl-slot="footer"
    variant="primary"
    onclick={onConfirmClick}
  >{ confirmText }</SLButton>

  {@render children?.()}
</SLDialog>
