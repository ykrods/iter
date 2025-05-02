<script lang="ts">
  import type { Project, Doc } from "$src/types";

  import { Collection } from "@signaldb/core";
  import svelteReactivityAdapter from "@signaldb/svelte";

  import EnsureAccessGranted from "./main/EnsureAccessGranted.svelte"
  import { asyncWorkerClient } from "$src/lib/asyncWorkerClient";
  import rewriteHTML from "$src/lib/rewriteHTML";

  let { project }: { project: Project } = $props()

  const client = asyncWorkerClient(navigator.serviceWorker);

  const Documents = new Collection<Doc>({
    reactivity: svelteReactivityAdapter
  })

  let doc: Doc | undefined = $state();
  let html: string = $state("")
  let documents = $derived(Documents.find({}).fetch());

  $effect(() => {
    Documents.insert({
      name: `foo.rst`,
      content: "* foo\n* bar\n* `foo <bar>`_\n\n.. image:: sample.png",
      key: `docs/foo.rst`,
      lastModified: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return () => client.close();
  });

  $effect(() => {
    if (doc) {
      client.rst2html(doc.content).then((r) => {
        const key = "docs/foo.rst";
        const origin = window.location.origin;
        html = rewriteHTML(r, { origin, key, project: project.id })
      });
    }
  });

</script>
<EnsureAccessGranted handle={project.handle}>
  <ul>
  {#each documents as document}
    <li><a href="" onclick={e => { e.preventDefault(); doc = document; }}>{ document.key }</a></li>
  {/each}
  </ul>
  <div>
    {#if html !== ""}
      {@html html}
    {/if}
  </div>
</EnsureAccessGranted>
