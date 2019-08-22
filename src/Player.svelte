<script>
  export let color;
  export let count;
  export let gameOver;
  export let number;
  export let player;
  export let maxScore;

  function randomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  function scorePercent(score, maxScore) {
    return Math.round((score / maxScore) * 100);
  }

  function translateX(score) {
    const width = 4;
    const margin = 2;
    const offsetForWidth = (score / 100) * width;
    const offsetForMargin = (score / 100) * margin;
    return `calc(${score}vw - ${offsetForMargin}em - ${offsetForWidth}em)`;
  }
</script>

<style>
  .player {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .player .name {
    font-size: 1.2rem;
    font-weight: 700;
    color: #333;
  }

  .marker {
    display: flex;
    flex-direction: column;
    position: relative;
    text-align: center;
    transition: transform 0.5s ease-out;
    width: 4rem;
  }

  .avatar {
    font-size: 4rem;
  }

  .score {
    color: #333;
    font-weight: 700;
    margin-bottom: 0.4rem;
  }
</style>

<section class="player" style="background-color: {color}">
  <span class="name">{player.name} ({number} of {count})</span>
  <span
    class="marker"
    style="transform: translateX({translateX(player.score, maxScore)};">
    <span class="avatar ec ec-{player.avatar}" />
    <span class="score">{player.score}</span>
  </span>
</section>
