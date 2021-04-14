<script>
  export let value;

  function format(date) {
    if (!date) return "-";

    const options = {
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
