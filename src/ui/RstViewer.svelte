<script>
  import { rst2html } from "../converter/client.js";

  export let rst;

  $: promise = rst2html(rst);
</script>
<div>
  {#await promise then html}
    {@html html}
  {/await}
</div>
