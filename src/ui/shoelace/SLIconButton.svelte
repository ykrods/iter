<script lang="ts">
  import type { Snippet } from 'svelte';
  import "@shoelace-style/shoelace/dist/components/icon-button/icon-button.js";

  let { children, ...props }: { children: Snippet } = $props();
</script>
<sl-icon-button {...props}>
  {@render children()}
</sl-icon-button>
