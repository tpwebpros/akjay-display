<script>
  import { onMount } from "svelte";

  import Board from "./Board.svelte";
  import GamePicker from "./GamePicker.svelte";
  import Client from "./client";
  import router from "./router";
  import { currentRoute } from "./stores";

  export let server;

  let client = new Client(server);

  let title = "Waiting for game";

  let state = {
    maxScore: 100,
    players: [
      { name: "alice", avatar: "mushroom", score: 0 },
      { name: "bob", avatar: "squid", score: 0 },
      { name: "charlie", avatar: "taco", score: 0 },
      { name: "dot", avatar: "cactus", score: 0 },
      { name: "ev", avatar: "owl", score: 0 }
    ]
  };

  let games = [];

  console.log({ server, state });

  function gameWinners(state) {
    return state.players.reduce(
      (best, p) => {
        if (p.score < state.maxScore) {
          return best;
        }

        if (p.score > best.score) {
          return { score: p.score, players: [p] };
        }

        if (p.score === best.score) {
          return { score: best.score, players: [...best.players, p] };
        }

        return best;
      },
      { score: 0, players: [] }
    );
  }

  function randomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  let randomUpdate = () => {
    const players = state.players.map(p => {
      const posNeg = randomInt(4) > 0 ? 1 : -0.5;
      const amount = randomInt(20) * posNeg;
      return {
        ...p,
        score: Math.min(100, Math.max(0, p.score + amount))
      };
    });

    update({ ...state, players });
  };

  let checkScore = async server => {
    try {
      const json = await client.getTeams(server, "/teams");
      console.log(json);
    } catch (err) {
      console.error(err);
    }
  };

  if (server.url) {
    setInterval(() => {
      checkScore(server);
    }, 1000);
  } else {
    setInterval(randomUpdate, 1000);
  }

  function update(newState) {
    let winning = gameWinners(newState);

    const winnerCount = winning.players.length;

    if (winnerCount > 0) {
      const label = winnerCount > 1 ? "Winners" : "Winner";
      title = `${label}: ${winning.players.map(p => p.name).join(", ")}, ${
        winning.score
      } points`;
      clearInterval(() => checkScore(server.url));
      newState.gameOver = true;
    } else {
      title = "Game on";
    }

    state = newState;
  }

  onMount(() => {
    currentRoute.set(window.location.pathname);

    if (!history.state) {
      window.history.replaceState(
        { path: window.location.pathname },
        "",
        window.location.href
      );
    }
  });

  function handleBackNavigation(event) {
    curRoute.set(event.state.path);
  }
</script>

<svelte:window on:popstate={handleBackNavigation} />

<main>
  <svelte:component this={router[$currentRoute]} {client} />
</main>
