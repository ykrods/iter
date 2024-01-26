<script>
  import { onMount } from "svelte";

  import { SLTree } from "$src/ui/shoelace.js";

  import TreeNode from "./TreeNode.svelte";

  export let project;
  export let needsReload = false;
</script>
<SLTree>
  <TreeNode
    on:fileSelected
    handle={project.handle}
    bind:needsReload
    key=""/>
</SLTree>
