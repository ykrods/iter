<script lang="ts">
  import type { Project } from "$src/types";

  let {
    project,
    projects,
    onOpenNewProject,
    onOpenRecentProject,
  }: {
    project: Project | undefined
    projects: Project[]
    onOpenNewProject: () => void
    onOpenRecentProject: (project: Project) => void
  } = $props()

  let menu: HTMLUListElement;
</script>
<header>
  <button
    class="btn btn-ghost"
    style="anchor-name:--project-dropdown-anchor"
    onclick={() => menu.togglePopover()}
  >{ project?.id ?? "project" }</button>
  <ul
    class="dropdown menu w-52 rounded-box bg-base-100 shadow-sm"
    bind:this={menu}
    popover
    style="position-anchor:--project-dropdown-anchor"
  >
    <li><button onclick={() => {
           menu.hidePopover();
           onOpenNewProject();
        }}>open</button></li>
    <li class="menu-title">Recents</li>
    {#each projects as proj }
      <li><button onclick={() => {
            menu.hidePopover();
            onOpenRecentProject(proj);
          }}>{ proj.id }</button></li>
    {/each}
  </ul>
</header>
