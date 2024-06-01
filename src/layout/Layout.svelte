<script lang="ts">
  import type { Snippet } from "svelte";

  import { fly } from "svelte/transition";

  import { SLIconButton } from "$src/ui/shoelace";

  import { showSidebarState } from "$src/AppState.svelte";


  const showSidebar = showSidebarState();

  let {
    children,
    sidebarContent,
  } : {
    children: Snippet
    sidebarContent: Snippet
  } = $props();

</script>
<div>
  <span class="toggleSidebarButton">
    <SLIconButton
      name="list"
      label="sidemenu"
      onclick={() => { showSidebar.toggle() }}
      />
  </span>
  {#if showSidebar.value }
    <aside class="sidebarWrap" transition:fly|local={{ x:-250, opacity:1 }}>
      {@render sidebarContent() }
    </aside>
  {/if}

  <div class="mainWrap" style={`left: ${ showSidebar.value ? 250: 0 }px`}>
    {@render children()}
  </div>
<!--
<Snackbar/>
-->
</div>
<style>
  .toggleSidebarButton {
    position: fixed;
    top: 1rem;
    left: 1rem;
    z-index: 30;
  }

  .sidebarWrap {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    width: 250px;
    z-index: 20;
  }
  .mainWrap {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-flow: column;
    transition: left 400ms cubic-bezier(0.215, 0.610, 0.355, 1.000);
    min-height: calc(100vh - var(--footer-height));
  }
</style>
