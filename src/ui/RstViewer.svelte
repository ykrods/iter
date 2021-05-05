<script>
  import { tick } from "svelte";

  import DOMPurify from "dompurify/dist/purify.es.js";
  import { push } from "svelte-spa-history-router";

  import { rst2html } from "../converter/client.js";
  import { currentProject } from "../stores.js";
  import { CachedHTML } from "../models/cached_html.js";

  let project = $currentProject;
  export let rst;
  let html;

  $: refresh(rst);

  async function refresh(rst) {
    if (typeof rst !== 'string' || rst === '') {
      html = null;
      return;
    }

    let cache = await CachedHTML.get(project, rst);

    if (cache) {
      html = cache.html;
    }

    const h = await rst2html(rst);
    const newHtml = DOMPurify.sanitize(h);

    if (html !== newHtml) {
      html = newHtml;
      const cache = await CachedHTML.build({ rst, html });
      await cache.save(project);
    }
  }

  $: onHtmlChanged(html);

  async function onHtmlChanged() {
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
<div on:click={captureClick}>
  {#if html}
    {@html html}
  {:else}
    <pre>{ rst }</pre>
  {/if}
</div>

<style>
  pre { white-space: pre-wrap ; }
</style>
