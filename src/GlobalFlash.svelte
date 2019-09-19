<script>
  import { flashError, flashSuccess } from "./stores";
  import Flash from "./Flash.svelte";
</script>

<Flash error={$flashError} success={$flashSuccess} />
