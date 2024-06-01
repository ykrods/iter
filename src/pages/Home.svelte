<script lang="ts">
  import type { Project } from "$src/types";

  let { project } : { project: Project } = $props()

  $effect(() => {
    console.log(project);
  });
</script>
<main id="Home">
  hogehoge
</main>
