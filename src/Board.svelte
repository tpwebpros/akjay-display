<script>
  import Player from "./Player.svelte";
  export let state;

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
  {#each state.players as player, i}
    <Player
      {player}
      count={state.players.length}
      number={i}
      color={colors[i]}
      maxScore={state.maxScore}
      gameOver={state.gameOver} />
  {/each}
</main>
