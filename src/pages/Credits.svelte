<script lang="ts">
  import Footer from "$src/layout/Footer.svelte";
</script>
<svelte:head>
  <title>Credits | iter</title>
</svelte:head>
<main>
  <div class="content">
    <h1>Credits</h1>
    <h2>Third-Party Notices</h2>
    <p class="notice-description">
      The followings are attribution notices of third party softwares or assets that may have been included as part of this application or used in the development of this. <br/>
      <br/>
      Many thanks to the contributors of these softwares.
    </p>
  </div>
  <div class="footerContainer">
    <Footer/>
  </div>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 100vh;
  }
  main > .footerContainer {
    margin-top: 2em;
  }
</style>
