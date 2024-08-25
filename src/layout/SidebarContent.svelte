<script lang="ts">
  import { link } from "svelte-spa-history-router";

  import Footer from "./Footer.svelte";

  let { project } : { project: Project } = $props();
</script>
<div class="sidebarContent">
  <ul>
    <li>
      <a use:link href={project.url("/")}>Home</a>
    </li>
    <li>
      <a use:link href={project.url("/notes")}>Notes</a>
    </li>
  </ul>
  <div class="footerContainer">
    <Footer/>
  </div>
</div>

<style>
  .sidebarContent {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 100vh;
    border-right: 1px solid var(--sl-color-neutral-200);
    background-color: var(--sl-color-neutral-0);
  }
  .sidebarContent > ul {
    margin-top: 4rem;
    padding: 0;
    list-style: none;
  }
  .sidebarContent > .footerContainer {
    margin-bottom: 0.5rem;
  }
</style>
