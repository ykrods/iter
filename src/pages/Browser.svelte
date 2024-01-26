<script>
  import { fly } from "svelte/transition";

  import { push, link, routeParams, currentURL } from "svelte-spa-history-router";

  import { SLIconButton } from "$src/ui/shoelace.js";

  import ProjectTree from "$src/ui/browser/ProjectTree.svelte";
  import GrantAccess from "$src/ui/browser/GrantAccess.svelte";
  import ContentProvider from "$src/ui/browser/ContentProvider.svelte";
  import Viewer from "$src/ui/browser/Viewer.svelte";

  export let project;

  let showSidebar = true;
  let needsReload = false;
  let needsResize = false;

  let projectTreeNeedsReload = false;

  $: contentKey = decodeURIComponent($routeParams.key);

  function fileSelected(event) {
    push(project.appUrl(event.detail));
  }

  function navigate(event) {
    if (event.detail.startsWith(window.location.origin)) {
      push(event.detail);
    } else {
      window.open(event.detail, "_blank", "noreferrer");
    }
  }
</script>
<svelte:head>
  <title>{ contentKey } | { project.id } | iter</title>
</svelte:head>
<GrantAccess {project}>
  <main id="Home">
    <span class="toggleSidebarButtonPosition">
      <SLIconButton
        name="list"
        label="sidemenu"
        on:click={() => { showSidebar = !showSidebar; }}
        />
    </span>
    {#if showSidebar}
      <aside class="sidebar-wrap" transition:fly={{ x:-250, opacity:1 }}>
        <div class="sidebar-header">
          <span class="ph"></span>
          <a use:link href="/">Top</a>
          <SLIconButton
            name="arrow-clockwise"
            label="Reload"
            on:click={() => { projectTreeNeedsReload = true; }}
            ></SLIconButton>
        </div>
        <ProjectTree
          {project}
          bind:needsReload={projectTreeNeedsReload}
          on:fileSelected={fileSelected}/>
      </aside>
    {/if}
    <div class="content-wrap"
      style={`left: ${ showSidebar ? 250: 0 }px`}
      on:transitionend={ () => { needsResize = true; } }
    >
      <div class="header">
        <h2>{ contentKey }</h2>
        <div class="icon-wrap">
          <SLIconButton
            name="arrow-clockwise"
            label="Reload"
            on:click={() => { needsReload = true; }}/>
        </div>
      </div>
      <div class="viewer">
        {#key contentKey }
          <ContentProvider
            {project}
            {contentKey}
            let:content
            let:lastModified
          >
            <Viewer
              url={ project.previewUrl(contentKey) }
              rst={ content }
              anchor={ $currentURL.hash }
              {lastModified}
              bind:needsReload
              bind:needsResize
              on:navigate={navigate} />
          </ContentProvider>
        {/key}
      </div>
    </div>
  </main>
</GrantAccess>

<style>
  .toggleSidebarButtonPosition {
    position: fixed;
    top: 20px;
    left: 20px;
    z-index: 30;
  }
  .sidebar-wrap {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    width: 250px;
    z-index: 20;
    border-right: 1px solid var(--sl-color-neutral-200);
    background-color: var(--sl-color-neutral-100);
    overflow: auto;

    & .sidebar-header {
      display: inline-flex;
      width: calc(100% - 40px);
      height: 33px;
      margin: 20px;
      align-items: center;
      justify-content: space-between;
      text-align: center;
    }

    & .ph {
      width: 33px;
      height: 33px;
    }
  }
  .content-wrap {
    position: absolute;
    top: 0;
    right: 0;
    transition: left 400ms cubic-bezier(0.215, 0.610, 0.355, 1.000);

    & .header {
      padding: 0 20px 0 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      & h2 {
        margin: 0px;
      }
      & .icon-wrap {
        font-size: 24px;
      }
    }
  }

  .viewer {
    min-height: 200px;
    margin: 20px;
    padding: 30px;
    background-color: #f8f8f8;
    border-radius: 5px;
  }
</style>
