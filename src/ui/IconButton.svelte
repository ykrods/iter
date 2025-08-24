<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    onclick,
    children,
  } : {
    onClick: () => void
    children: Snippet
  } = $props();
</script>
<button
  {onclick}
  class="btn btn-sm btn-ghost btn-circle"
>
  {@render children()}
</button>
