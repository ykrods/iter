<script lang="ts">
  import type { Snippet } from 'svelte';

  import SlButton from "@shoelace-style/shoelace/dist/components/button/button.js";

  type propKeys =
    | "variant"
    | "disabled"
    | "type"
    | "form" ;

  type Props = Partial<Pick<SlButton, propKeys>> & {
    onclick?: () => void,
  }

  let {
    children,
    ...props
  } : {
    children: Snippet,
  } & Props = $props();

</script>
<sl-button {...props}>
  {@render children()}
</sl-button>
