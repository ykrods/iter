<script>
  import { onDestroy } from 'svelte';
  import { Snackbar, Button } from "svelte-mui";

  import { snackbarMessage } from "../stores.js"

  const levelColors = {
    info: "var(--message-info, gray)",
    warning: "var(--message-warning, yellow)",
    error: "var(--message-error, red)",
  }

  let visible = false;
  let message = "";
  let bg = levelColors.info;
  let timerId;

  $: if ($snackbarMessage) {
    show();
  };

  function show() {
    message = $snackbarMessage.message;
    bg = levelColors[$snackbarMessage.level];

    visible = true;
    timerId = setTimeout(() => {
      visible = false;
      snackbarMessage.clear();
    }, 5000);
  }

  function dismiss() {
    clearTimeout(timerId);
    timerId = undefined;
    snackbarMessage.clear();
    visible = false;
  }

  onDestroy(() => {
    clearTimeout(timerId);
    timerId = undefined;
  });
</script>

<Snackbar bind:visible bind:bg bottom timeout=0>
  {message}
  <span slot="action">
    <Button color="white" on:click={dismiss}>x</Button>
  </span>
</Snackbar>
