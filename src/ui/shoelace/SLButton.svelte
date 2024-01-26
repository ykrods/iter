<script>
  import "@shoelace-style/shoelace/dist/components/button/button.js";

  export let variant = "primary";
</script>
<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
<sl-button {variant} on:click>
  <slot></slot>
</sl-button>
