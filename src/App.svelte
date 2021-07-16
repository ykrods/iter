<script>
  // css bundle
  import "../public/viewer.css";
  import "../public/global.css";
  import "../public/vendor/docutils/math.css";
  import "../public/vendor/pygments/default.css";

  import { onMount } from "svelte";
  import { Router, link } from "svelte-spa-history-router";

  import { currentProject } from "./stores.js";
  import routes from "./routes.js"

  import Header from "./ui/Header.svelte";
  import Snackbar from "./ui/Snackbar.svelte";

  // start worker setup
  import { rst2html } from "./converter/client.js";
  rst2html("start");

  onMount(async () => {
    await import('/vendor/mermaid-8.9.2/mermaid.min.js');
    mermaid.initialize({startOnLoad:false});
  });
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
