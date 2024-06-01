<script lang="ts">
  import type { Snippet } from 'svelte';

  import SlDialog from "@shoelace-style/shoelace/dist/components/dialog/dialog";

  type propKeys =
    | "label"

  type Props = Partial<Pick<SlDialog, propKeys>>

  let {
    showRequest = $bindable(false),
    hideRequest = $bindable(false),
    children,
    footer,
    ...props
  } : {
    showRequest: boolean,
    hideRequest: boolean,
    children: Snippet,
    footer?: Snippet,
  } & Props = $props();

  let dialog: SlDialog

  $effect(() => {
    if (showRequest) {
      showRequest = false;
      dialog.show();
    }
  });

  $effect(() => {
    if (hideRequest) {
      hideRequest = false;
      dialog.hide();
    }
  });
</script>
<sl-dialog bind:this={dialog} {...props}>
  {@render children()}

  {#if footer}
    <span slot="footer">
      {@render footer()}
    </span>
  {/if}
</sl-dialog>
