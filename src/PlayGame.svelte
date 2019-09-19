<script>
  import { onMount } from "svelte";
  import { slide } from "svelte/transition";
  import { cubicOut } from "svelte/easing";
  import { flashError, flashSuccess } from "./stores";
  import { gameWinners } from "./utils";
  import Flash from "./Flash.svelte";
  import GlobalFlash from "./GlobalFlash.svelte";
  import Link from "./Link.svelte";
  import Team from "./Team.svelte";

  export let client;
  export let teamId;
  export let gameId;
  export let gameInstanceId;

  let updateInterval = 3000; // 3s
  let team = null;
  let title = "Loading...";
  let gameOver = false;
  let checker;

  let questions = {};
  let currentQuestion = null;

  let answerError = "";
  let answerSuccess = "";

  let winners = [];

  $: {
    if (checker && gameOver) {
      clearInterval(checker);
    }
  }

  $: title = gameOver ? "Game over" : title;

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

  async function getGameInstance(gameInstanceId) {
    try {
      return await client.getGameInstance(gameInstanceId);
    } catch (err) {
      console.error(err);
    }
  }

  async function checkForWinners() {
    const response = await getGameInstance(gameInstanceId);
    const winners = gameWinners(response);
    console.log(winners);
    if (winners.teams.length > 0) {
      gameOver = true;
    }
  }

  function clearFlash() {
    $flashError = "";
    $flashSuccess = "";
    answerError = "";
    answerSuccess = "";
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
    clearFlash();
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
        answerSuccess = `Correct! ${response.message || ""}`;
        currentQuestion = null;
        allFalse(questions, isCurrent);
        getTeam();
      } else if (response.code === "nomatch") {
        answerError = "Wrong! Try again.";
      } else {
        answerError = `Unexpected response code=${response.code}`;
      }
    } catch (err) {
      console.log(err);
      answerError = err.message;
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

    checker = setInterval(() => {
      checkForWinners(gameInstanceId);
    }, updateInterval);
  });
</script>

<style>
  header {
    background-color: #eee;
    border-bottom: 1px solid #aaa;
    height: 5rem;
    margin-left: -8px;
    padding: 0.5rem;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 10;
  }

  .header-space {
    height: 5rem;
  }

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

<header>
  {#if team}
    <Team name={team.name} avatar={team.avatar} score={team.score} />
  {:else}
    <p>Loading team...</p>
  {/if}
</header>

<div class="header-space" />

<h1>{title}</h1>

<GlobalFlash />

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
        <Flash error={answerError} success={answerSuccess} />
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
