<script>
  import "@shoelace-style/shoelace/dist/components/button/button";
  import "@shoelace-style/shoelace/dist/components/textarea/textarea";

  import { getContext } from "svelte";
  import { push } from "svelte-spa-history-router";

  import Dialog from "./Dialog.svelte";

  import { contextKey } from "../../models/project.js";
  import { Journal } from "../../models/journal.js";

  const { getProject } = getContext(contextKey);

  export let open;

  const project = getProject();

  let submitable = true;
  let body = "";

  async function onSubmit() {
    const journal = Journal.build({ body });
    await project.db.journals.put(journal);
    open = false;
  }
</script>

<Dialog label="Create journal" bind:open>
  <sl-textarea
    on:sl-input={ e => { body = e.target.value }}
    value={body}
    required
  ></sl-textarea>
  <sl-button
    slot="footer"
    variant="primary"
    on:click={onSubmit}
    disabled={ !submitable }
  >Create</sl-button>
</Dialog>
