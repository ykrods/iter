<script lang="ts">
  import { tick } from "svelte";

  // import mermaid from "mermaid";

  import "$src/styles/viewer.css";
  import "$src/styles/docutils-0.21.1/math.css";
  import "$src/styles/pygments-2.17.2/default.css";

  let {
    html,
    onNavigate,
  } : {
    html: string
    onNavigate: (string) => any
  } = $props();

  // mermaid.initialize({ startOnLoad: false });


  $effect(() => {
    // Render mermaid diagram if contained
    if (typeof html === 'string' && html.includes('mermaid')) {
      // tick().then(() => mermaid.run());
    }
  });

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
      // push(anchor.pathname);
      onNavigate(anchor.pathname);
    }
  }
</script>
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div role="none" onclick={captureClick}>
  {@html html}
</div>
