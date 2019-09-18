<script>
  import { onMount } from "svelte";
  import { flashError, flashSuccess } from "./stores";
  import Team from "./Team.svelte";

  export let client;
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

  async function handleAnswer(event) {
    const inputs = event.target.elements;
    const questionId = inputs["questionId"].value;
    const answerText = inputs["answerText"].value.trim();
    try {
      const response = await client.answerQuestion({
        answerText,
        gameId,
        questionId,
        teamId
      });
      if (response.code === "match") {
        $flashSuccess = "Correct! You got xxx points.";
      } else if (response.code === "nomatch") {
        $flashError = "Wrong! Try again.";
      } else {
        $flashError = `Unexpected response code=${response.code}`;
      }
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
          <input type="hidden" name="questionId" value={question.RowKey} />
          <label for="answerText">Your answer</label>
          <textarea name="answerText" />
          <button type="submit">Submit</button>
        </form>
      {/if}
    </li>
  {/each}
</ol>
