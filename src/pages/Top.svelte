<script lang="ts">
  import type { Project, IterIDB } from "$src/types";

  import { link } from "svelte-spa-history-router";

  import { getDB } from "$src/lib/idb";

  let idb: IterIDB = getDB();
  let projects: Project[] = $state([])

  $effect(() => {
    loadProjects()
  })

  async function loadProjects() {
    projects = await idb.projects.getAll()
  }

  async function saveProject(project: Project) {
    await idb.projects.put(project);
  }

  async function open() {
    const handle = await window.showDirectoryPicker({ mode: "readwrite" });
    await saveProject({
      id: handle.name,
      handle,
      openedAt: new Date(),
    });
    loadProjects();
  }
</script>
<ul>
  {#each projects as project}
    <li><a use:link href={`/${project.id}/`}>{ project.id }</li>
  {/each}
</ul>
<div>
  <button onclick={open}>open</button>
</div>
