<script>
  import "@shoelace-style/shoelace/dist/components/menu-item/menu-item.js";
</script>
<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
<sl-menu-item on:click>
  <slot></slot>
</sl-menu-item>
