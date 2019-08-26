<script>
  export let client;
  export let teamId;

  let team = null;

  client.getTeam(teamId).then(response => {
    team = response;
    return client.getGameInstance(team.instanceId);
  });
</script>

<h1>Game on</h1>
