<script>
  export let error = "";
  export let success = "";
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

  [data-success="true"] {
    display: block;
    margin: 1em;
    padding: 1em;
    background-color: hsla(114, 100%, 83%, 1);
    border: 1px solid hsla(114, 100%, 22%, 1);
    color: hsla(114, 100%, 22%, 1);
  }
</style>

<div>
  <div class="success" data-success={success !== ''}>{success}</div>
  <div class="error" data-error={error !== ''}>{error}</div>
</div>
