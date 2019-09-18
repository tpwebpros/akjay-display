<script>
  import { onMount } from "svelte";
  import Link from "./Link.svelte";

  export let client;

  let games = [];

  onMount(() => {
    client.getGames().then(response => {
      games = response.data;
    });
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
    <li>
      <Link
        page={{ path: `/games/${game.RowKey}`, title: `${game.name} (${game.maxScore} points)` }} />
    </li>
  {/each}
</ul>
