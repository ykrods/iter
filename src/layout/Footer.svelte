<script lang="ts">
  import { link } from "svelte-spa-history-router";
</script>
<footer>
  <a use:link href="/">top</a>
  | <a href="https://github.com/ykrods/iter" target="_blank" rel="noreferrer">iter</a>
  | <a use:link href="/credits">credits</a>
</footer>
<style>
  footer {
    margin-bottom: 5px;
    height: 22px;
    text-align: center;
    font-size: 0.9em;
  }
</style>
