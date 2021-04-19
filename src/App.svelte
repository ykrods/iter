<script>
  import { Router } from "svelte-spa-history-router";

  import { currentProject } from "./stores.js";
  import routes from "./routes.js"

  import Header from "./ui/Header.svelte";
  import Snackbar from "./ui/Snackbar.svelte";

  // start worker setup
  import { rst2html } from "./converter/client.js";
</script>

<div class="app">
  <Header />
  <div class="mainContainer">
    {#if $currentProject }
      <aside>
        <div class="card">side</div>
      </aside>
    {/if}
    <div class="main">
      <Router {routes}/>
    </div>
  </div>
  <footer>powered by iter</footer>
  <Snackbar/>
</div>

<style>
  .mainContainer {
    display: flex;
    justify-content: center;
    min-height: calc(100vh - var(--header-height) - var(--footer-height) - 30px);
    margin: 15px 0;
  }
  .mainContainer > aside {
    flex: 0 0 200px;
    margin: 0 15px 0 10px;
  }
  .mainContainer > .main {
    flex: 1;
    max-width: 650px;
    margin: 0;
  }
  footer {
    height: var(--footer-height);
    color: #33;
    text-align: center;
    font-size: 0.9em;
  }
</style>
