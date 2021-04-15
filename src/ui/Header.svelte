<script>
  import { Button, Icon, Menu, Menuitem } from "svelte-mui";
  import { push, link } from "svelte-spa-history-router";

  import { currentProject } from "../stores.js";
  import { Project } from "../models/project.js";

  import AddNoteDialog from "./dialogs/AddNoteDialog.svelte"

  let showAddNoteDialog = false;
  let projectsPromise = Promise.resolve();

  function menuReload() {
    projectsPromise = Project.list();
  }

  function onSettingsPushed() {
    push($currentProject.url("/settings"));
  }
</script>

<header>
  <div class="logo"><a class="nav-link" use:link href="/">iter</a></div>
  {#if $currentProject }
    <Menu origin="top left">
      <div slot="activator">
        <Button on:click={menuReload}>
          { $currentProject.id }
          <Icon path="M 2 7 L 12 17 L 22 7z" style="margin: 0 -4px 0 8px;" />
        </Button>
      </div>
      {#await projectsPromise then projects }
        {#each projects as project}
          <Menuitem href={ project.url() }>{ project.id }</Menuitem>
        {/each}
      {/await}
    </Menu>
    <a class="nav-link" use:link href={$currentProject.url()}>Journal</a>
    <a class="nav-link" use:link href={$currentProject.url("/issues")}>Issues</a>
    <a class="nav-link" use:link href={$currentProject.url("/wiki")}>Wiki</a>
    <Button icon on:click={() => { showAddNoteDialog = true; }}>N+</Button>
    <span class="right">
      <Button icon on:click={onSettingsPushed}>SE</Button>
    </span>
  {/if}
</header>
<AddNoteDialog bind:visible={showAddNoteDialog} />

<style>
  header {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 20;
    width: 100%;
    height: var(--header-height);

    display: flex;
    align-items: center;

    background-color: #fafafb;
    box-shadow: var(--bs-100);
  }

  .logo {
    font-size: 1.4em;
    font-weight: bold;
    margin: 0 10px;
  }

  .nav-link {
    margin: 0 5px;
    font-weight: bold;
    color: #555;
    margin: 0 10px;
    font-weight: bold;
    text-decoration: none;
  }
  .nav-link:link, .nav-link:visited {
    color: #777;;
  }
  .nav-link:hover {
    color: var(--accent);
  }

  .right {
    margin: 0 10px 0 auto;
  }
</style>
