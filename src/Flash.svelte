<script>
  import { flashError, flashMessage } from "./stores";
</script>

<style>
  .error {
    display: none;
  }

  [data-error="true"] {
    display: block;
    margin: 1em;
    padding: 1em;
    background-color: hsla(16, 100%, 90%, 1);
    border: 1px solid hsla(16, 100%, 40%, 1);
    color: hsla(16, 100%, 40%, 1);
  }
</style>

<div>
  <div class="error" data-error={$flashError !== ''}>{$flashError}</div>
</div>
