<script>
  import { onMount, createEventDispatcher } from "svelte";

  import { SLTreeItem, SLIcon } from "$src/ui/shoelace.js";

  export let handle;
  export let key;
  export let needsReload = false;

  let promise = getChildren();

  const dispatch = createEventDispatcher();

  $: if (needsReload) {
    promise = getChildren();
    needsReload = false;
  }

  async function getChildren() {
    const _children = [];
    if (handle.kind === "directory") {
      for await (const entry of handle.values()) {
        _children.push(entry);
      }
    }
    return _children;
  }

  async function itemSelected(evt) {
    if (handle.kind === "file") {
      dispatch("fileSelected", key);
    }
  }
  function getKey(name) {
    if (0 === key.length) {
      return name;
    } else {
      return `${key}/${name}`;
    }
  }
</script>
<SLTreeItem
  on:fileSelected
  on:click={itemSelected}
>
  {#if handle.kind === "directory"}<SLIcon name="folder"/>{/if}
  { handle.name }
  {#await promise then children}
    {#each children as child}
      <svelte:self
        on:fileSelected
        bind:needsReload
        handle={child}
        key={getKey(child.name)}/>
    {/each}
  {/await}
</SLTreeItem>
