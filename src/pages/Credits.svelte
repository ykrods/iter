<script>
  import { ExpansionPanel } from "svelte-mui";
  let group = "";
  import notices from "../third-party-notices.json";
</script>
<main>
  <h1>Credits</h1>
  <h2>Third-Party Notices</h2>
  <p class="notice-description">
    The followings are attribution notices of third party softwares or assets that may have been included as part of this application or used in the development of this. <br/>
    <br/>
    Many thanks to the contributors of these softwares.
  </p>
  {#each notices as pkg }
    <ExpansionPanel
      dense
      name={`${pkg.name} @ ${pkg.version} / ${ pkg.license }`}
      bind:group
    >
      <div>
        {#if pkg.homepage }
          <p class="url" >URL: <a target="_blank" href={pkg.homepage}>{ pkg.homepage }</a></p>
        {/if}
        {#if pkg.noticeText }
          <h3>NOTICE</h3>
          <pre class="text">{ pkg.noticeText }</pre>
        {/if}
        <pre class="text">{ pkg.licenseText }</pre>
      </div>
    </ExpansionPanel>
  {/each}
</main>
<style>
  .url {
    margin: 0 0 25px 0;
  }
  pre.text {
    font-size: 0.95em;
    white-space: pre-wrap ;
  }
  .notice-description {
    margin: 25px 0;
  }
</style>
