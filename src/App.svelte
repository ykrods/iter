<script>
  import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js';

  import Router from "./Router.svelte";
  import "./global.css";

  setBasePath('/shoelace');
</script>
<div class="app">
  <Router/>
</div>
