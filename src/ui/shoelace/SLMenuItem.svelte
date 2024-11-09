<script lang="ts">
  import type { Snippet } from "svelte";

  import SlMenuItem from "@shoelace-style/shoelace/dist/components/menu-item/menu-item";


  let {
    children,
    onclick = null,
    variant = "",
  }: {
    children: Snippet
    variant: string
    onclick: SLMenuItem["onclick"]
  } = $props();
</script>
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<sl-menu-item
  {onclick}
  class:danger={ variant === "danger"}
>
  {@render children()}
</sl-menu-item>
