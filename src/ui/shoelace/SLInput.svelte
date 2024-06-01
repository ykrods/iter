<script lang="ts">
  import SlInput from "@shoelace-style/shoelace/dist/components/input/input.js";

  type propKeys =
    | "type"
    | "label"
    | "maxlength"
    | "minlength"
    | "required"
    | "pattern"

  type Props = Partial<Pick<SlInput, propKeys>> & {
    "help-text"?: SlInput["helpText"]
  }

  let {
    value = $bindable(""),
    ...props
  } : {
    value?: string,
  } & Props = $props();

  let input: SlInput;

  $effect(() => {
    const onSlInput = () => { value = input.value; }

    input.addEventListener("sl-input", onSlInput);

    return () => {
      input.removeEventListener("sl-input", onSlInput);
    }
  });
</script>
<sl-input bind:this={input} {value} {...props}></sl-input>
