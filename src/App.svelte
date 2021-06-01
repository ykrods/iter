<script>
  import { Router, link } from "svelte-spa-history-router";

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
    <Router {routes}/>
  </div>
  <footer>
    <a href="https://github.com/ykrods/iter" target="_blank">project</a>
    | <a use:link href="/credits">credits</a>
  </footer>
  <Snackbar/>
</div>

<style>
  .mainContainer {
    min-height: calc(100vh - var(--header-height) - var(--footer-height) - 15px);
    padding-top: var(--header-height);
    width: 640px;
    margin: 0 auto;
  }
  footer {
    margin-top: 15px;
    height: var(--footer-height);
    color: #333;
    text-align: center;
    font-size: 0.9em;
  }
</style>
