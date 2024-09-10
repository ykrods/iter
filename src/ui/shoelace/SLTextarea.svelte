<script lang="ts">
  import SlTextarea from "@shoelace-style/shoelace/dist/components/textarea/textarea";

  type propKeys =
    | "label"
    | "disabled"
    | "resize"
    | "rows";

  type Props = Partial<Pick<SlTextarea, propKeys>> & {
    "help-text"?: SlTextarea["helpText"]
  }

  let {
    value = $bindable(""),
    ...props
  } : {
    value?: string,
  } & Props = $props();

  let textarea: SlTextarea;

  $effect(() => {
    const onSlInput = () => { value = textarea.value; }

    textarea.addEventListener("sl-input", onSlInput);

    return () => {
      textarea.removeEventListener("sl-input", onSlInput);
    }
  });
</script>
<sl-textarea bind:this={textarea} {value} {...props}></sl-textarea>
