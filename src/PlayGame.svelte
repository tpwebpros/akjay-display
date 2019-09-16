<script>
  import { onMount } from "svelte";
  import { flashError } from "./stores";

  export let client;
  export let router;
  export let teamId;

  let team = null;
  // 14051850-d57c-11e9-896a-1987f01c4c17

  onMount(async () => {
    try {
      const response = await client.getTeam(teamId);
      return client.getGameInstance(team.instanceId);
    } catch (err) {
      $flashError = err.message;
    }
  });
</script>

<h1>Game on</h1>
