<script>
  import { onMount } from "svelte";
  import { gameWinners } from "./utils";
  import Player from "./Player.svelte";

  export let client;
  export let gameInstanceId;
  export let updateInterval = 3000;

  let state = {
    teams: [],
    maxScore: Infinity,
    gameOver: false
  };

  let title = "Waiting for game...";
  let subtitle = "";
  let gameId;

  const colors = [
    "salmon",
    "cornflowerblue",
    "gold",
    "mediumpurple",
    "limegreen"
  ];

  let getGameInstanceUpdate = async gameInstanceId => {
    try {
      const json = await client.getGameInstance(gameInstanceId);

      // Only fetch the game once
      if (!gameId) {
        gameId = json && json.data && json.data.gameId;
        if (gameId) {
          getGame(gameId);
        }
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
      const { maxScore, name } = game.data;
      state = updateState(state, { maxScore });
      subtitle = `Playing ${name || "a game"}`;
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

<h1>{title}</h1>
<h2>{subtitle}</h2>

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
