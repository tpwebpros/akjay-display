<script>
  import Player from "./Player.svelte";

  export let client;
  export let gameInstanceId;

  let state = {
    teams: [],
    maxScore: 100,
    gameOver: false
  };

  let serverUpdate = {
    teams: []
  };

  let title = "";

  const colors = [
    "salmon",
    "cornflowerblue",
    "gold",
    "mediumpurple",
    "limegreen"
  ];

  function gameWinners(state) {
    return state.teams.reduce(
      (best, p) => {
        if (p.score < state.maxScore) {
          return best;
        }

        if (p.score > best.score) {
          return { score: p.score, teams: [p] };
        }

        if (p.score === best.score) {
          return { score: best.score, teams: [...best.teams, p] };
        }

        return best;
      },
      { score: 0, teams: [] }
    );
  }

  let getGameUpdate = async gameInstanceId => {
    try {
      const json = await client.getGameInstance(gameInstanceId);
      state = updateState(state, json);
      console.log(json);
    } catch (err) {
      console.error(err);
    }
  };

  setInterval(() => {
    getGameUpdate(gameInstanceId);
  }, 1000);

  function updateState(oldState, serverUpdate) {
    const newState = { ...oldState };
    if (Array.isArray(serverUpdate.teams)) {
      newState.teams = serverUpdate.teams;
    }

    let winning = gameWinners(newState);
    console.log(winning);

    const winnerCount = winning.teams.length;

    if (winnerCount > 0) {
      const label = winnerCount > 1 ? "Winners" : "Winner";
      title = `${label}: ${winning.teams.map(p => p.name).join(", ")}, ${
        winning.score
      } points`;
      clearInterval(() => checkScore(server.url));
      newState.gameOver = true;
    } else {
      title = "Game on";
    }

    return newState;
  }
</script>

<style>
  .board {
    height: 80%;
    display: flex;
    flex-direction: column;
  }
</style>

<div class="board">
  {#each state.teams as player, i}
    <Player
      {player}
      count={state.teams.length}
      number={i}
      color={colors[i % colors.length]}
      maxScore={state.maxScore}
      gameOver={state.gameOver} />
  {/each}
</div>
