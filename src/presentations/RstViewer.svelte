<script lang="ts">
  import "$src/styles/viewer.css";
  import "$src/styles/docutils-0.20.1/math.css";
  import "$src/styles/pygments-2.16.1/default.css";

  import { push } from "svelte-spa-history-router";

  import { asyncWorkerClient } from "$src/lib/asyncWorkerClient";

  let { rst } : { rst: string } = $props();

  let html = $state("");

  const client = asyncWorkerClient(navigator.serviceWorker);

  $effect(() => {
    loadHTML(rst);
  });

  async function loadHTML(rst) {
    html = await client.rst2html(rst);
  }

  function captureClick(event) {
    if (event.target.tagName.toLowerCase() !== 'a') {
      return;
    }
    // Ignore external link
    if (event.target.hostname !== window.location.hostname) {
      event.preventDefault();
      window.open(event.target.href, "_blank", "noopener,noreferrer");
      return;
    }
    // Ignore fragment jump
    if (event.target.pathname === window.location.pathname &&
        event.target.hash !== window.location.hash) {
      return;
    }
    if (event.target.pathname) {
      event.preventDefault();
      push(event.target.pathname);
    }
  }
</script>
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div role="none" onclick={captureClick}>
  {#if html != ""}
    {@html html}
  {/if}
</div>
