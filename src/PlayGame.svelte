<script>
  import { onMount } from "svelte";
  import { flashError } from "./stores";

  export let client;
  export let router;
  export let teamId;
  export let gameId;
  export let gameInstanceId;

  let team = null;
  // 14051850-d57c-11e9-896a-1987f01c4c17
  // 485e7d91-d8f5-11e9-98cb-8594f13a77af

  let questions = [];
  let currentQuestion = undefined;

  onMount(async () => {
    try {
      const response = await client.getQuestions(gameId);
      if (Array.isArray(response.data)) {
        questions = response.data;
      }
    } catch (err) {
      console.log(err);
      $flashError = err.message;
    }
  });
</script>

<h1>Game on</h1>

<h2>Choose a question</h2>

<ul>
  {#each questions as question}
    <li>{question.questionText}</li>
  {/each}
</ul>
