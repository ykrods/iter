<script>
  import { onMount, createEventDispatcher } from "svelte";

  export let url;
  export let needsReload = false;
  export let needsResize = false;

  const dispatch = createEventDispatcher();

  let contentFrame;

  $: onUrlChange(url);

  $: if (needsReload) {
    contentFrame && contentFrame.contentWindow.location.reload();
    needsReload = false;
  }

  $: if (needsResize) {
    contentFrame && resize();
    needsResize = false;
  }

  function onUrlChange() {
    contentFrame && ( contentFrame.height = 150 );
  }

  function resize() {
    const doc = contentFrame.contentWindow.document;
    let h = 150;
    if (doc.documentElement.tagName === "svg") {
      h = doc.documentElement.clientHeight;
    } else if (doc.body.firstElementChild.tagName.toLowerCase() === "img") {
      h = doc.body.scrollHeight;
      console.log(h);
    } else {
      // 詳細不明だが、iframe では clientHeight が iframe.height の値になる？
      h = doc.body.offsetHeight;
    }

    // FIXME: mermaid レンダリング時に高さが足りなくなる時があるので + 100 している
    contentFrame.height = Math.max(h, 100) + 100;
  }

  function onContentLoaded(event) {
    resize();

    if (event.target.contentWindow.document.body) {
      const convertUrl = (href) => {
        if (!href.startsWith(window.location.origin)) {
          return href;
        }
        let ret = href.replace("/p/", "/a/");
        const basename = ret.split("/").pop();
        if (basename !== "" && basename.indexOf(".") === -1) {
          return ret + ".rst";
        }
        return ret;
      };
      const body = event.target.contentWindow.document.body;
      body.querySelectorAll("a").forEach((a) => {
        a.href = convertUrl(a.href);
        a.addEventListener("click", (e) => {
          e.preventDefault();
          dispatch("navigate", e.target.href);
        });
      });
    }
  }
</script>
<iframe class="contentFrame"
  title="content"
  frameborder="0"
  bind:this={contentFrame}
  on:load={onContentLoaded}
  src={ url }/>
<style>
  .contentFrame {
    width: 100%;
  }
</style>
