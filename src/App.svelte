<script>
  import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js';

  // css bundle
  import "./static/global.css";

  setBasePath('/_/shoelace');

  let hoge = "hoge0";
</script>
<div>
  { hoge }
</div>
