<script>
  import { tick } from "svelte";

  import DOMPurify from "dompurify/dist/purify.es.js";
  import { push } from "svelte-spa-history-router";

  import { rst2html } from "../converter/client.js";

  export let rst;
  let html;

  $: refresh(rst);

  async function refresh(rst) {
    if (typeof rst !== 'string' || rst === '') {
      html = null;
      return;
    }
    const h = await rst2html(rst);
    console.log(h);
    html = DOMPurify.sanitize(h);
    console.log(html);

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
<div>
  {#if html}
    {@html html}
  {/if}
</div>
