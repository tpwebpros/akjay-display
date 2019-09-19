<script>
  import { onMount } from "svelte";
  import { slide } from "svelte/transition";
  import { cubicOut } from "svelte/easing";
  import { flashError, flashSuccess } from "./stores";
  import Link from "./Link.svelte";
  import Team from "./Team.svelte";

  export let client;
  export let teamId;
  export let gameId;
  export let gameInstanceId;

  let team = null;

  let questions = {};
  let currentQuestion = null;

  // Local key for tracking the current question
  const isCurrent = "isCurrentQuestion";

  async function getQuestions() {
    try {
      const response = await client.getQuestions(gameId);
      const newQuestions = {};

      for (const q of response.data) {
        newQuestions[q.RowKey] = q;
      }

      questions = newQuestions;
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

  function allFalse(list, property) {
    const updated = {};
    for (let [key, value] of Object.entries(list)) {
      updated[key] = { ...value, [property]: false };
    }
    return updated;
  }
  // Toggle the given property for one item in the list.
  // All other items have the property set to `false`
  function toggleOne(list, id, property) {
    const previousValue = list[id][property];
    const toggled = allFalse(list, property);
    toggled[id][property] = previousValue ? false : true;

    return toggled;
  }

  function chooseQuestion(event) {
    const parent = event.target.parentElement;
    const id = parent.dataset["id"];
    if (questionIsAnswered(questions[id], team)) {
      return;
    }
    questions = toggleOne(questions, id, isCurrent);
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
        $flashSuccess = `Correct! ${response.message || ""}`;
        currentQuestion = null;
        allFalse(questions, isCurrent);
        getTeam();
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

  function questionIsAnswered(question, team) {
    if (!team || !question) {
      return false;
    }
    return team.answeredQuestions.includes(question.RowKey);
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

  .current {
    font-weight: bold;
  }

  .disabled {
    cursor: not-allowed;
    opacity: 0.5;
    font-weight: normal;
  }

  .answer {
    margin: 1em 0;
    font-weight: normal;
  }

  .answer textarea,
  .answer label,
  .answer button {
    display: block;
  }

  .answer textarea {
    max-width: 30em;
    width: 100%;
  }

  .answer button {
    margin-top: 0.8em;
  }
</style>

<h1>Game on</h1>

{#if team}
  <Team name={team.name} avatar={team.avatar} score={team.score} />
{/if}

<p>
  <Link
    page={{ path: `/board/${gameInstanceId}`, title: 'All teams' }}
    target="_blank" />
</p>

<h2>Choose a question</h2>

<ol>
  {#each Object.values(questions) as question (question.RowKey)}
    <li
      class:current={question[isCurrent]}
      class:disabled={questionIsAnswered(question, team)}>
      <div
        class="question"
        class:disabled={questionIsAnswered(question, team)}
        data-id={question.RowKey}
        on:click|preventDefault={chooseQuestion}>
        <span class="text">
          {@html question.questionText}
        </span>
        <span class="value">({question.value} points)</span>
        {#if questionIsAnswered(question, team)}
          <span class="answered ec ec-trophy" />
        {/if}
      </div>
      {#if question === currentQuestion && currentQuestion[isCurrent]}
        <form
          transition:slide={{ duration: 300, easing: cubicOut }}
          class="answer"
          on:submit|preventDefault={handleAnswer}>
          <input type="hidden" name="questionId" value={question.RowKey} />
          <label for="answerText">Your answer</label>
          <textarea name="answerText" rows="6" cols="40" />
          <button type="submit">Submit</button>
        </form>
      {/if}
    </li>
  {/each}
</ol>
