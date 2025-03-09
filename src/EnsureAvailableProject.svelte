<script lang="ts">
  import type { Snippet } from "svelte";
  import type { Project } from "./types";

  import EnsureAccessGranted from "./EnsureAccessGranted.svelte";


  let {
    project = $bindable(),
    children,
    getProjects,
    saveProject,
  }: {
    project: Project | undefined
    children: Snippet
    getProjects: () => Promise<Project[]>
    saveProject: (project: Project) => Promise<any>
  } = $props();

  $effect(() => {
    loadProjects();
  });

  async function loadProjects() {
    const projects: Project[] = await getProjects();
    // TODO: UI で切り替えた時を考慮しないとでは
    if (0 < projects.length) {
      project = projects[0];
    }
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
{#if project}
  <EnsureAccessGranted handle={project.handle}>
    {@render children()}
  </EnsureAccessGranted>
{:else}
  <button onclick={open}>open</button>
{/if}
