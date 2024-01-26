<script>
  import "@shoelace-style/shoelace/dist/components/icon-button/icon-button.js";

  export let name;
  export let label;
</script>
<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
<sl-icon-button {name} {label} on:click>
  <slot></slot>
</sl-icon-button>
