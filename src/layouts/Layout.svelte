<script>
  import "@shoelace-style/shoelace/dist/components/icon-button/icon-button";

  import { fly } from "svelte/transition";
  import { link } from "svelte-spa-history-router";

  import SidebarContent from "./SidebarContent.svelte";
  import Footer from "./Footer.svelte";

  let showSidebar = true;
</script>
<div class="layout">
  <sl-icon-button
    name="list"
    label="sidemenu"
    class="toggleSidebarButton"
    on:click={() => { showSidebar = !showSidebar; }}
  />

  {#if showSidebar}
    <aside class="sidebarWrap" transition:fly|local={{ x:-250, opacity:1 }}>
      <SidebarContent/>
    </aside>
  {/if}

  <div class="mainWrap" style={`left: ${ showSidebar ? 250: 0 }px`}>
    <div class="contentWrap"><slot></slot></div>
    <Footer/>
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
    border-right: 1px solid var(--sl-color-neutral-200);
    background-color: var(--sl-color-neutral-0);
  }
  .mainWrap {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-flow: column;
    transition: left 400ms cubic-bezier(0.215, 0.610, 0.355, 1.000);
  }
  .contentWrap {
    min-height: calc(100vh - var(--footer-height));
  }
</style>
