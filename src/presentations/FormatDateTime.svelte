<script lang="ts">
  let { value }: { value: Date } = $props();


  function format(date: Date): string {

    if (!date) return "-";

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour12: false,
      hour: "numeric",
      minute: "2-digit",
    };
    return new Intl.DateTimeFormat("default", options).format(date);
  }
</script>
<span>{ format(value) }</span>
