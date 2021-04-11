<script>
  import { Router } from "svelte-spa-history-router";

  import { currentProject } from "./stores.js";
  import routes from "./routes.js"

  import Header from "./ui/Header.svelte";
</script>

<div class="app">
  <Header />
  <div class="mainContainer">
    {#if $currentProject }
      <aside>side</aside>
    {/if}
    <Router {routes}/>
  </div>
  <footer>powered by iter</footer>
</div>

<style>
  .app {
    font-size: 18px;
  }
  .mainContainer {
    display: flex;
    justify-content: center;
    min-height: calc(100vh - var(--header-height) - var(--footer-height) - 20px);
    margin-bottom: 20px;
  }

  footer {
    height: var(--footer-height);
    color: #33;
    text-align: center;
    font-size: 0.9em;
  }
</style>
