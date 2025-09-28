<script lang="ts">
  import type { Snippet } from "svelte";
  import type { SlSwitch } from "@shoelace-style/shoelace";
  import type { BaseProps } from "./types";

  import "@shoelace-style/shoelace/dist/components/switch/switch";
  import { slProps } from "./lib"

  type Props = {
    checked: boolean
    children: Snippet
  } & BaseProps;

  let {
    checked = $bindable(false),
    children,
    ...props
  }: Props = $props();


  function onChange(evt: Event) {
    checked = (evt.target as SlSwitch).checked;
  }
</script>
<sl-switch onsl-change={onChange} {checked} {...slProps(props)}>
  {@render children()}
</sl-switch>
