<script>
  export let score;
</script>

<style>
  .score {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    margin: 0.2em 1em 0.4em;
  }

  .score :first-child {
    background-color: #444;
    border-radius: 0.5em;
    color: #eee;
    display: inline-block;
    font-size: 1rem;
    font-weight: 700;
    height: 1.4em;
    min-width: 2em;
    padding: 0.3em;
    position: relative;
    text-align: center;
  }

  .score :nth-child(2) {
    font-size: 0.8rem;
  }
</style>

<span class="score">
  <span>{score}</span>
  <span>score</span>
</span>
