<script>
  import { onMount } from "svelte";

  import "@shoelace-style/shoelace/dist/components/button/button";

  export let variant = "primary";
  export let disabled = false;
</script>
<sl-button
  slot="footer"
  {variant}
  on:click
  {disabled}
><slot></slot></sl-button>
