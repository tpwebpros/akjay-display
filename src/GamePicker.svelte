<script>
  export let client;

  let games = [];

  client.getGames().then(response => {
    games = response.data;
    console.log(response);
  });
</script>

<style>
  h1 {
    color: #333;
  }
</style>

<h1>Pick a game</h1>

<ul>
  {#each games as game}
    <a href="#">
      <li class="game">{game.name}</li>
    </a>
  {/each}
</ul>
