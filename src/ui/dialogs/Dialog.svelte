<script>
  import "@shoelace-style/shoelace/dist/components/dialog/dialog.js";

  import { onMount } from "svelte";


  export let open;
  export let label;

  let dialog;

  onMount(() => {
    const afterHide = () => { open = false; };

    dialog.addEventListener('sl-after-hide', afterHide);

    return () => {
      dialog.removeEventListener('sl-after-hide', afterHide);
    };
  });


  $: onOpenChange(open);

  function onOpenChange() {
    if (!dialog) return;

    // sl-afterhide で open = false にした場合
    if (!open && !dialog.open) return;

    if (open) {
      dialog.show();
    } else {
      dialog.hide();
    }
  }

</script>

<sl-dialog {label} bind:this={dialog}>
  <slot></slot>
  <slot name="footer"></slot>
</sl-dialog>
