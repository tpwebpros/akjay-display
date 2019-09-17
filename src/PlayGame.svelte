<script>
  import { onMount } from "svelte";
  import { flashError } from "./stores";
  import Team from "./Team.svelte";

  export let client;
  export let router;
  export let teamId;
  export let gameId;
  export let gameInstanceId;

  let team = null;

  let questions = [];
  let currentQuestion = undefined;

  async function getQuestions() {
    try {
      const response = await client.getQuestions(gameId);
      if (Array.isArray(response.data)) {
        questions = response.data;
      }
    } catch (err) {
      console.log(err);
      $flashError = err.message;
    }
  }

  async function getTeam() {
    try {
      const response = await client.getTeam(teamId);
      team = response.data;
    } catch (err) {
      console.log(err);
      $flashError = err.message;
    }
  }

  onMount(() => {
    getQuestions();
    getTeam();
  });
</script>

<h1>Game on</h1>

{#if team}
  <Team name={team.name} avatar={team.avatar} />
{/if}

<h2>Choose a question</h2>

<ul>
  {#each questions as question}
    <li>{question.questionText}</li>
  {/each}
</ul>
