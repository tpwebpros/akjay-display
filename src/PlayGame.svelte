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

  let questions = {};
  let currentQuestion = undefined;

  async function getQuestions() {
    try {
      const response = await client.getQuestions(gameId);
      if (Array.isArray(response.data)) {
        questions = response.data.reduce((acc, q) => {
          acc[q.RowKey] = q;
          return acc;
        }, {});
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

  function chooseQuestion(event) {
    const id = event.target.parentElement.dataset["id"];
    currentQuestion = questions[id];
  }

  function handleAnswer() {}

  onMount(() => {
    getQuestions();
    getTeam();
  });
</script>

<style>
  .question {
    cursor: pointer;
  }
</style>

<h1>Game on</h1>

{#if team}
  <Team name={team.name} avatar={team.avatar} />
{/if}

<h2>Choose a question</h2>

<ol>
  {#each Object.values(questions) as question}
    <li on:click>
      <div
        class="question"
        data-id={question.RowKey}
        on:click|preventDefault={chooseQuestion}>
        <span class="text">
          {@html question.questionText}
        </span>
        <span class="value">({question.value} points)</span>
      </div>
      {#if question === currentQuestion}
        <form on:submit|preventDefault={handleAnswer}>
          <label for={question.RowKey}>Your answer</label>
          <textarea name={question.RowKey} />
          <button type="submit">Submit</button>
        </form>
      {/if}
    </li>
  {/each}
</ol>
