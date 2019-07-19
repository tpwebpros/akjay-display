<script>
  import Player from "./Player.svelte";
  export let players;

  const colors = [
    "salmon",
    "cornflowerblue",
    "gold",
    "mediumpurple",
    "limegreen"
  ];
</script>

<style>
  .board {
    height: 80%;
    display: flex;
    flex-direction: column;
  }
</style>

<main class="board">
  {#each players as player, i}
    <Player {player} count={players.length} number={i} color={colors[i]} />
  {/each}
</main>
