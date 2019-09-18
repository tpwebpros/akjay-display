<script>
  export let avatar;
  export let size = "2rem";
  $: name = avatar && avatar !== "none" ? avatar : "question";
</script>

<span class="avatar ec ec-{name}" style="font-size: {size}" />
