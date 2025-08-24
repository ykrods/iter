<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    buttonContent,
    content,
    class: dropdownClass = "w-42",
    buttonClass = "",
  }: {
    buttonContent: Snippet
    content: Snippet<[() => void]>
    class: string
    buttonClass: string
  } = $props()

  const uid = $props.id();
  const popoverId = `popover-${uid}`;
  const anchorName = `--popover-anchor-${uid}`;

  let dropdown: HTMLUListElement;

  function close() {
    requestAnimationFrame(() => {
      dropdown.hidePopover();
    });
  }
</script>
<button
  class="btn ${buttonClass}"
  popovertarget={popoverId}
  style:anchor-name={anchorName}
>
  {@render buttonContent()}
</button>
<ul
  bind:this={dropdown}
  class="dropdown menu rounded-box bg-base-100 shadow-sm {dropdownClass}"
  popover
  id={popoverId}
  style:position-anchor={anchorName}
>
  {@render content(close)}
</ul>
