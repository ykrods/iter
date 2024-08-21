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

  async function loadHTML(rst: string) {
    html = await client.rst2html(rst);
  }

  function captureClick(event: Event) {
    if ((event.target as HTMLElement).tagName.toLowerCase() !== 'a') {
      return;
    }
    let anchor = event.target as HTMLAnchorElement;

    // Ignore external link
    if (anchor.hostname !== window.location.hostname) {
      event.preventDefault();
      window.open(anchor.href, "_blank", "noopener,noreferrer");
      return;
    }
    // Ignore fragment jump
    if (anchor.pathname === window.location.pathname &&
        anchor.hash !== window.location.hash) {
      return;
    }
    if (anchor.pathname) {
      event.preventDefault();
      push(anchor.pathname);
    }
  }
</script>
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div role="none" onclick={captureClick}>
  {#if html != ""}
    {@html html}
  {/if}
</div>
