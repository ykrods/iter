<script>
  import { Button, Icon } from 'svelte-mui';

  export let id = undefined;
</script>

<Button {id} on:click icon color='#00796b' raised>
  <Icon path="M 2 10 v 4 h 8 v 8 h 4 v -8 h 8 v -4 h -8 v -8 h -4 v 8z" />
</Button>
