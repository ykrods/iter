<script>
  import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js';

  import Router from "./Router.svelte";

  // css bundle
  import "./static/global.css";

  setBasePath('/_/shoelace');
</script>
<div>
  <Router/>
</div>
