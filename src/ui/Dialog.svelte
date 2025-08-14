<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    open = $bindable(false),
    title = "",
    children,
    action,
  }: {
    open: boolean
    title: string
    children?: Snippet
    action?: Snippet
  } = $props();

  let dialog: HTMLDialogElement;

  $effect(() => {
    const onClose = () => {
      open = false;
    };
    dialog.addEventListener("close", onClose);
    return () => {
      dialog.removeEventListener("close", onClose);
    };
  });

  $effect(() => {
    if (open && !dialog.open) { dialog.showModal() }
    if (!open && dialog.open) { dialog.close() }
  })
</script>
<dialog bind:this={dialog} class="modal">
  <div class="modal-box max-w-2xl">
    {#if title}
      <h3 class="text-lg font-bold">{ title }</h3>
    {/if}
    <p class="py-4">
      {@render children?.()}
    </p>
    {#if action}
      <div class="modal-action">
        {@render action()}
      </div>
    {/if}
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
