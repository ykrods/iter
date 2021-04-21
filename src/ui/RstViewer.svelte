<script>
  import DOMPurify from "dompurify/dist/purify.es.js";
  import { push } from "svelte-spa-history-router";

  import { rst2html } from "../converter/client.js";

  export let rst;

  $: promise = refresh(rst);

  function refresh(rst) {
    if (typeof rst !== 'string' || rst === '') {
      return Promise.resolve();
    }
    return rst2html(rst);
  }

  // Render mermaid diagram if contained
  /*
  $: if (typeof html === 'string' && html.includes('mermaid')) {
    tick().then(() => {
      mermaid.init();
    });
  }
  */

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
  {#await promise then html}
    {@html DOMPurify.sanitize(html)}
  {/await}
</div>
