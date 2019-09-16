<script>
  import { redirect } from "./router";
  import { flashError } from "./stores";

  export let client;
  export let gameInstanceId;
  export let router;

  let name = "";
  let avatar = "";
  let avatars = ["mushroom", "squid", "taco", "cactus", "owl"];

  async function handleSubmit() {
    try {
      const params = { name, avatar, gameInstanceId };
      const response = await client.createTeam(params);
      const teamId = response.newId;
      redirect(`/play/${teamId}`);
    } catch (err) {
      $flashError = err.message;
    }
  }
</script>

<style>
  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>

<h1>Create a team</h1>

<div class="create-team">
  <form on:submit|preventDefault={handleSubmit}>
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
    <p>Name: {name}</p>
    <p>Avatar: {avatar}</p>
  </div>
</div>
