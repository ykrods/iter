<script lang="ts">
  import type { Snippet } from 'svelte';

  import "@shoelace-style/shoelace/dist/components/button/button.js";

  let { children, ...props } : { children: Snippet } = $props();
</script>
<sl-button {...props}>
  {@render children()}
</sl-button>
