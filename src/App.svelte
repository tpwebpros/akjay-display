<script>
  import { onMount, beforeUpdate } from "svelte";

  import Board from "./Board.svelte";
  import Flash from "./Flash.svelte";
  import GamePicker from "./GamePicker.svelte";
  import GameInstancePicker from "./GameInstancePicker.svelte";
  import JoinGame from "./JoinGame.svelte";
  import PlayGame from "./PlayGame.svelte";
  import Client from "./client";
  import Router, { redirect, pathWithQueryString } from "./router";
  import { currentRoute } from "./stores";

  export let server;

  let client = new Client(server);

  const router = new Router({
    "/": GamePicker,
    "/games": GamePicker,
    "/games/:gameId": GameInstancePicker,
    "/join/:gameInstanceId": JoinGame,
    "/play/:teamId": PlayGame,
    "/board/:gameInstanceId": Board
  });

  let title = "Waiting for game";

  let route;

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

  let updateInterval = 3000; // 3 seconds

  beforeUpdate(() => {
    const match = router.match($currentRoute);
    if (match) {
      route = match;
    } else {
      alert(`Not found: ${$currentRoute}`);
    }
  });

  onMount(() => {
    const path = window.location.pathname;
    const queryString = window.location.search;
    const route = pathWithQueryString(path, queryString);
    currentRoute.set(route);

    if (!history.state) {
      window.history.replaceState(
        { path, queryString },
        "",
        window.location.href
      );
    }
  });

  function handleBackNavigation(event) {
    const { path, queryString } = event.state;
    const route = pathWithQueryString(path, queryString);
    currentRoute.set(route);
  }
</script>

<svelte:window on:popstate={handleBackNavigation} />

<main>
  <Flash />
  {#if route.component === Board}
    <Board {client} {...route.data} {updateInterval} />
  {:else}
    <svelte:component this={route.component} {client} {...route.data} />
  {/if}
</main>
