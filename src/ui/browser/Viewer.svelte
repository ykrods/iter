<script>
  import { createEventDispatcher } from "svelte";

  import { initAsyncMessage } from "$src/worker/client.js";

  export let url;
  export let rst;
  export let needsReload = false;
  /** turn on when viewer width has changed */
  export let needsResize = false;
  export let anchor;
  export let lastModified;

  let contentFrame;

  const dispatch = createEventDispatcher();
  const rst2html = initAsyncMessage(navigator.serviceWorker, "rst2html");

  $: if (lastModified) {
    needsReload = true;
  }

  $: if (needsReload) {
    contentFrame && contentFrame.contentWindow.location.reload();
    needsReload = false;
  }

  $: if (needsResize) {
    contentFrame && resize();
    needsResize = false;
  }

  $: if (anchor) {
    // hash を変えると window.history に積まれてしまうので手動でスクロールする
    // contentFrame.contentWindow.location.hash = anchor;
    contentFrame && contentFrame.contentDocument.querySelector(anchor)?.scrollIntoView();
  }

  async function onLoad() {
    if (rst) {
      await renderRstDoc();
    }
    resize();
  }

  async function renderRstDoc() {
    const html = await rst2html(rst);

    // render html to iframe
    const doc = contentFrame.contentWindow.document;
    doc.body.innerHTML = html;

    const replaceUrl = (href) => {
      if (!href.startsWith(window.location.origin)) {
        return href;
      }
      return href.replace("/p/", "/a/");
    };

    doc.body.querySelectorAll("a").forEach((a) => {
      a.href = replaceUrl(a.href);
      a.addEventListener("click", (e) => {
        e.preventDefault();
        dispatch("navigate", e.target.href);
      });
    });

    doc.body.querySelectorAll("img").forEach((img) => {
      if (!img.complete) {
        img.onload = () => { needsResize = true }
      }
    });

    if (html.includes("mermaid")) {
      const script = doc.createElement("script");
      script.innerHTML = `(async () => {
  const mermaid = (await import("https://cdn.jsdelivr.net/npm/mermaid@10.7.0/+esm")).default;
  mermaid.initialize({ startOnLoad: false });
  await mermaid.run();
})()`;
      doc.body.appendChild(script);
      // FIXME: catch finish rendering event
      setTimeout(() => { needsResize = true }, 500);
    }
  }

  function resize() {
    const h = getDocumentHeight(contentFrame.contentWindow.document);
    contentFrame.height = Math.max(h, 150);
  }

  function getDocumentHeight(doc) {
    if (doc.documentElement.tagName === "svg") {
      return doc.documentElement.viewBox.baseVal.height;
    }

    const fields = ["scrollHeight", "offsetHeight", "clientHeight"];

    let ret = 0;
    ["body", "documentElement"].forEach((elm) => {
      if (doc[elm]) {
        const values = fields.map(f => doc[elm][f] || 0);
        ret = Math.max(ret, ...values);
      }
    });

    return ret;
  }
</script>
{#key url}
  <iframe class="contentFrame"
    title="content"
    frameborder="0"
    bind:this={contentFrame}
    on:load={ onLoad }
    src={ url }/>
{/key}
<style>
  .contentFrame {
    width: 100%;
  }
</style>
