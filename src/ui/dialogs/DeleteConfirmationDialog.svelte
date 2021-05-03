<script>
  import { createEventDispatcher } from 'svelte';
  import { Dialog, Button } from 'svelte-mui';

  const dispatch = createEventDispatcher();

  export let visible = false;
  export let target = null;
  export let message = 'Are you sure?';

  async function onDeletePushed() {
    visible = false;
    dispatch('deleteConfirmed', target);
  }

</script>

<Dialog bind:visible>
  <div slot="title">Confirmation</div>
  <p>{message}</p>
  <div slot="actions" class="actions center">
    <Button on:click={() => { visible = false; }}>Cancel</Button>
    <Button color="var(--danger, red)" on:click={onDeletePushed}>Delete</Button>
  </div>
</Dialog>
