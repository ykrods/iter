<script>
  import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js';

  import Router from "./Router.svelte";
  import { rst2html } from "./converter/client.js";

  // css bundle
  import "./static/viewer.css";
  import "./static/global.css";
  import "./static/vendor/docutils-v0.19/math.css";
  import "./static/vendor/pygments-v2.13.0/default.css";

  setBasePath('/_/shoelace');

  // start worker setup
  rst2html("start");
</script>
<div class="app">
  <Router/>
</div>
