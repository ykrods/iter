<script lang="ts">
  import type { Project } from "$src/types";

  import EnsureAccessGranted from "./main/EnsureAccessGranted.svelte"
  import { asyncWorkerClient } from "$src/lib/asyncWorkerClient";
  import rewriteHTML from "$src/lib/rewriteHTML";

  let { project }: { project: Project } = $props()

  const client = asyncWorkerClient(navigator.serviceWorker);

  let html = $state("")

  const doc = `
.. image:: sample.png
`;

  $inspect(project)

  $effect(() => {
    client.rst2html(doc).then((r) => {
      const key = "docs/foo.rst";
      const origin = window.location.origin;
      html = rewriteHTML(r, { origin, key, project: project.id })
    });

    return () => client.close();
  });
</script>
<EnsureAccessGranted handle={project.handle}>
  <div>
    {#if html !== ""}
      {@html html}
    {/if}
  </div>
</EnsureAccessGranted>
