<script lang="ts">
  import SlIcon from "@shoelace-style/shoelace/dist/components/icon/icon";

  let props: {
    name: SlIcon["name"]
    label?: SlIcon["label"]
  } = $props();
</script>
<sl-icon {...props}></sl-icon>
