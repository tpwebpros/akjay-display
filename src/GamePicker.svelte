<script>
  import Link from "./Link.svelte";

  export let client;

  let games = [];

  client.getGames().then(response => {
    games = response.data;
    console.log(response);
  });

  // Pick game -> List instances -> Create team (post to /teams) -> Play game
  // Answered questions stored on team record
</script>

<style>
  h1 {
    color: #333;
  }
</style>

<h1>Pick a game</h1>

<ul>
  {#each games as game}
    <li>
      <Link page={{ path: `/games/${game.RowKey}`, title: game.name }} />
    </li>
  {/each}
</ul>
