<script lang="ts">
  import type { Snippet } from "svelte";

  import "@shoelace-style/shoelace/dist/components/dropdown/dropdown";
  import type { SlSelectEvent } from "@shoelace-style/shoelace"


  let {
    children,
    trigger = undefined,
    onSelect = undefined,
    ...props
  }: {
    children: Snippet
    trigger: Snippet | undefined
    onSelect?: (evt: SlSelectEvent) => any | undefined
  } = $props();
</script>
<sl-dropdown onsl-select={onSelect} {...props}>
  {#if trigger }
    <span slot="trigger">{@render trigger()}</span>
  {/if}
  {@render children()}
</sl-dropdown>
