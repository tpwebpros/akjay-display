<script>
  import { onMount } from "svelte";
  import Link from "./Link.svelte";

  export let client;
  export let gameId;

  let instances = [];

  function getGameInstances() {
    client.getGameInstances(gameId).then(response => {
      instances = response.data;
    });
  }

  async function newGame() {
    await client.createGameInstance(gameId);
    getGameInstances();
  }

  onMount(getGameInstances);
</script>

<style>
  h1 {
    color: #333;
  }
</style>

<h1>Join a game</h1>

<ul>
  {#each instances as instance}
    <li>
      <Link
        page={{ path: `/join/${instance.RowKey}`, params: { gameId }, title: instance.RowKey }} />
    </li>
  {/each}
</ul>

<button on:click={newGame}>New game</button>
