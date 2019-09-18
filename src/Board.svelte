<script>
  import { onMount } from "svelte";
  import Player from "./Player.svelte";

  export let client;
  export let gameInstanceId;
  export let updateInterval;

  let state = {
    teams: [],
    maxScore: Infinity,
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

  let getGameInstanceUpdate = async gameInstanceId => {
    try {
      const json = await client.getGameInstance(gameInstanceId);
      const gameId = json && json.data && json.data.gameId;
      if (gameId) {
        getGame(gameId);
      }
      state = updateState(state, json);
    } catch (err) {
      console.error(err);
    }
  };

  setInterval(() => {
    getGameInstanceUpdate(gameInstanceId);
  }, updateInterval);

  function updateState(oldState, serverUpdate) {
    const newState = { ...oldState };
    if (Array.isArray(serverUpdate.teams)) {
      newState.teams = serverUpdate.teams;
    }

    if (serverUpdate.maxScore) {
      newState.maxScore = serverUpdate.maxScore;
    }

    const winning = gameWinners(newState);
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

  async function getGame(gameId) {
    try {
      const game = await client.getGame(gameId);
      const maxScore = game && game.data && game.data.maxScore;
      state = updateState(state, { maxScore });
    } catch (err) {
      console.error(err);
    }
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
