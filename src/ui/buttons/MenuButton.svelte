<script>
  import { Button, Icon } from 'svelte-mui';
  import MenuIcon from '../icons/menu.svg';
</script>

<Button on:click icon color='#00796b' unelevated dense>
  <Icon><svelte:component this={MenuIcon}/></Icon>
</Button>
