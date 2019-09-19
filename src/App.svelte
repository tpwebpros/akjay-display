<script>
  import { beforeUpdate } from "svelte";

  import Board from "./Board.svelte";
  import GamePicker from "./GamePicker.svelte";
  import GameInstancePicker from "./GameInstancePicker.svelte";
  import JoinGame from "./JoinGame.svelte";
  import PlayGame from "./PlayGame.svelte";
  import Client from "./client";
  import Router, { redirect, pathWithQueryString } from "./router";
  import { currentRoute } from "./stores";

  export let server;

  const client = new Client(server);

  const router = new Router({
    "/": GamePicker,
    "/games": GamePicker,
    "/games/:gameId": GameInstancePicker,
    "/join/:gameInstanceId": JoinGame,
    "/play/:teamId": PlayGame,
    "/board/:gameInstanceId": Board
  });

  let route;
  let updateInterval = 3000; // 3 seconds

  beforeUpdate(() => {
    route = router.match($currentRoute);
  });

  function handleBackNavigation(event) {
    const { path, queryString } = event.state;
    $currentRoute = pathWithQueryString(path, queryString);
  }

  // Set initial route once on load. Doesn't work in
  // onMount() because that fires after the first render
  (() => {
    const path = window.location.pathname;
    const queryString = window.location.search;
    const initialRoute = pathWithQueryString(path, queryString);
    $currentRoute = initialRoute;
    route = router.match($currentRoute);

    if (!history.state) {
      window.history.replaceState(
        { path, queryString },
        "",
        window.location.href
      );
    }
  })();
</script>

<svelte:window on:popstate={handleBackNavigation} />

<main>
  {#if route.component === Board}
    <Board {client} {...route.data} {updateInterval} />
  {:else}
    <svelte:component this={route.component} {client} {...route.data} />
  {/if}
</main>
