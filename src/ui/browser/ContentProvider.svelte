<script>
  import { onMount } from "svelte";

  export let project;
  export let contentKey;

  let lastModified = null;
  let content = null;

  onMount(() => {
    loadFile();
    const timerID = setInterval(loadFile, 2000);

    return () => {
      clearInterval(timerID);
    };
  });

  async function loadFile() {
    try {
      const fh = await project.getContent(contentKey);
      const file = await fh.getFile();

      if (lastModified !== file.lastModified) {
        lastModified = file.lastModified;
        if (file.name.endsWith(".rst")) {
          content = await file.text();
        }
      }
    } catch(e) {
      if (e instanceof Error) {
        if (e.name === "NotAllowedError") {
          console.log("not allowed");
        } else if (e.name === "NotFoundError") {
          console.log("not found");
        } else {
          console.error(e);
        }
      } else {
        console.error(e);
      }
    }
  }
</script>
<slot {content} {lastModified}></slot>
