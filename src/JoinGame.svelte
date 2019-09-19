<script>
  import { onMount } from "svelte";
  import { redirect } from "./router";
  import { flashError } from "./stores";
  import Flash from "./Flash.svelte";
  import Team from "./Team.svelte";

  export let client;
  export let gameId;
  export let gameInstanceId;

  let name = "";
  let avatar = "";
  let avatars = [
    "avocado",
    "cactus",
    "crab",
    "metal",
    "mushroom",
    "owl",
    "pizza",
    "robot",
    "rocket",
    "squid",
    "sushi",
    "taco",
    "unicorn"
  ];
  let teams = {};
  let assumedTeamId;
  $: assumedTeam = currentAssumedTeam(assumedTeamId);

  function currentAssumedTeam(id) {
    if (id != null) {
      return teams[id];
    }
  }

  async function handleCreateTeam() {
    try {
      const params = { name, avatar, gameInstanceId };
      const response = await client.createTeam(params);
      const teamId = response.newId;
      redirect(`/play/${teamId}`, { gameInstanceId, gameId });
    } catch (err) {
      $flashError = err.message;
    }
  }

  async function handlePlayTeam() {
    try {
      redirect(`/play/${assumedTeamId}`, { gameInstanceId, gameId });
    } catch (err) {
      $flashError = err.message;
    }
  }

  onMount(async () => {
    try {
      const response = await client.getGameInstance(gameInstanceId);
      if (Array.isArray(response.teams)) {
        teams = response.teams.reduce((acc, team) => {
          acc[team.RowKey] = team;
          return acc;
        }, {});
      }
    } catch (err) {
      console.log(err);
      $flashError = err.message;
    }
  });
</script>

<style>
  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .choices {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-evenly;
  }

  .separator {
    margin: 3em 1em;
  }
</style>

<h1>Join the game</h1>

<Flash />

<div class="choices">
  <div class="create-team">
    <h2>Create a team</h2>
    <form on:submit|preventDefault={handleCreateTeam}>
      <label for="name">Team name</label>
      <input type="text" name="name" bind:value={name} />

      <label for="avatar">Avatar</label>
      <select name="avatar" bind:value={avatar}>
        <option selected />
        {#each avatars as a}
          <option value={a}>{a}</option>
        {/each}
      </select>

      <button disabled={!name || !avatar} type="submit">Create team</button>
    </form>

    <div class="preview">
      <Team {name} {avatar} />
    </div>
  </div>

  <div class="separator">or</div>

  <div>
    <h2>Play an existing team</h2>
    <form on:submit|preventDefault={handlePlayTeam}>
      <select bind:value={assumedTeamId}>
        <option selected />
        {#each Object.values(teams) as team}
          <option value={team.RowKey}>{team.name}</option>
        {/each}
      </select>

      <button disabled={!assumedTeamId} type="submit">Play with team</button>

    </form>

    <div class="preview">
      {#if assumedTeam}
        <Team name={assumedTeam.name} avatar={assumedTeam.avatar} />
      {/if}
    </div>
  </div>
</div>
