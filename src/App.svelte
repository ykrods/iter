<script lang="ts">
  import type { Project } from "$src/types"
  import EnsureAvailableProject from "./EnsureAvailableProject.svelte";
  import EnsureFileSystemAccessAPI from "./EnsureFileSystemAccessAPI.svelte";
  import EnsureServiceWorker from "./EnsureServiceWorker.svelte";
  import Router from "./Router.svelte";

  import { asyncWorkerClient } from "$src/lib/asyncWorkerClient";
  import { getDB } from "$src/lib/idb";


  const client = asyncWorkerClient(navigator.serviceWorker);
  let db = getDB();

  let project: Project | undefined = $state();


  $effect(() => {
    client.rst2html(`* foo`).then(r => console.log(r));

    return () => client.close();
  });
</script>
<div>
  <EnsureFileSystemAccessAPI>
    <EnsureServiceWorker>
      <EnsureAvailableProject
        bind:project
        getProjects={() => db.projects.getAll()}
        saveProject={(project: Project) => db.projects.put(project)}
      >
        <Router></Router>
      </EnsureAvailableProject>
    </EnsureServiceWorker>
  </EnsureFileSystemAccessAPI>
</div>
<style>
</style>
