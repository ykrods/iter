<script>
  import { tick } from "svelte";

  import { push } from "svelte-spa-history-router";

  import { initAsyncMessage } from "$src/worker/client.js";

  export let rst;

  let htmlPromise;

  const rst2html = initAsyncMessage(navigator.serviceWorker, "rst2html");

  $: onRstChange(rst);

  async function onRstChange() {
    htmlPromise = rst2html(rst);

    const html = await htmlPromise;

    // Render mermaid diagram if contained
    if (typeof html === 'string' && html.includes('mermaid')) {
      await tick();
      window.mermaid.init();
    }
  }

  function captureClick(event) {
    if (event.target.tagName !== 'A') {
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
      push(event.target.href);
    }
  }
</script>
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div on:click={captureClick}>
  {#await htmlPromise }
    <!-- <pre>{ rst }</pre> -->
  {:then html}
    {@html html}
  {:catch error}
    <p style="color:red">{ error.message }</p>
    <pre>{ rst }</pre>
  {/await}
</div>

<style>
  pre { white-space: pre-wrap ; }
</style>
