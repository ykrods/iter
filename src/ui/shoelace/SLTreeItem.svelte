<script>
  import "@shoelace-style/shoelace/dist/components/tree-item/tree-item.js";
</script>
<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
<sl-tree-item on:click>
  <slot></slot>
</sl-tree-item>
