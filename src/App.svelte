<script>
  import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js';

  import Router from "./Router.svelte";
  import "./global.css";

  setBasePath('/_/shoelace');

  // start worker setup
  import { rst2html } from "./converter/client.js";
  rst2html("start");
</script>
<div class="app">
  <Router/>
</div>
