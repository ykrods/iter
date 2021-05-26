<script>
  import { Button, Icon, Menu, Menuitem } from "svelte-mui";
  import { push, link } from "svelte-spa-history-router";

  import CaretDown from "@fortawesome/fontawesome-free/svgs/solid/caret-down.svg";
  import Cog from "@fortawesome/fontawesome-free/svgs/solid/cog.svg";
  import FileAlt from "@fortawesome/fontawesome-free/svgs/regular/file-alt.svg";
  import Search from "@fortawesome/fontawesome-free/svgs/solid/search.svg";

  import { currentProject } from "../stores.js";
  import { Project } from "../models/project.js";

  import EditNoteDialog from "./dialogs/EditNoteDialog.svelte";
  import SearchDialog from "./dialogs/SearchDialog.svelte";

  let showAddNoteDialog = false;
  let showSearchDialog = false;
  let projectsPromise = Promise.resolve();

  function menuReload() {
    projectsPromise = Project.list();
  }

  function onSettingsPushed() {
    push($currentProject.url("/settings"));
  }
</script>

<header>
  <div class="logo"><a class="nav-link" use:link href="/">iter(β)</a></div>
  {#if $currentProject }
    <Menu origin="top left">
      <div slot="activator">
        <Button on:click={menuReload}>
          { $currentProject.id }
          <Icon><svelte:component this={CaretDown}/></Icon>
        </Button>
      </div>
      {#await projectsPromise then projects }
        {#each projects as project}
          <Menuitem on:click={ push(project.url("/issues")) }>{ project.id }</Menuitem>
        {/each}
      {/await}
    </Menu>
    <a class="nav-link" use:link href={$currentProject.url("/notes")}>Notes</a>
    <a class="nav-link" use:link href={$currentProject.url("/issues")}>Issues</a>
    <a class="nav-link" use:link href={$currentProject.url("/wiki/")}>Wiki</a>
    <a class="nav-link" use:link href={$currentProject.url("/files")}>Files</a>
    <Button id="create-note-button" icon dense on:click={() => { showAddNoteDialog = true; }}>
      <svelte:component this={FileAlt}/>
    </Button>
    <Button id="search-button" icon dense on:click={() => { showSearchDialog = true; }}>
      <svelte:component this={Search}/>
    </Button>
    <span class="right">
      <Button id="settings-button" icon dense on:click={onSettingsPushed}>
        <svelte:component this={Cog}/>
      </Button>
    </span>
  {/if}
</header>
<EditNoteDialog bind:visible={showAddNoteDialog} />
<SearchDialog bind:visible={showSearchDialog} />

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
