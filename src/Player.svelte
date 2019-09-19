<script>
  import Avatar from "./Avatar.svelte";
  import Score from "./Score.svelte";
  export let color;
  export let count;
  export let gameOver;
  export let number;
  export let player;
  export let maxScore;

  const avatarSize = "4rem";

  function scorePercent(score, maxScore) {
    return Math.round((score / maxScore) * 100);
  }

  function translateX(score) {
    const width = 4;
    const margin = 2;
    const percent = scorePercent(score, maxScore);
    const offsetForWidth = (percent / 100) * width;
    const offsetForMargin = (percent / 100) * margin;
    return `calc(${percent}vw - ${offsetForMargin}em - ${offsetForWidth}em)`;
  }
</script>

<style>
  .player {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .player .name {
    color: #333;
    font-size: 1.2rem;
    font-weight: 700;
    margin: 0.4rem;
  }

  .marker {
    display: flex;
    flex-direction: column;
    position: relative;
    text-align: center;
    transition: transform 0.5s ease-out;
    width: 4rem;
  }
</style>

<section class="player" style="background-color: {color}">
  <span class="name">{player.name}</span>
  <span
    class="marker"
    style="transform: translateX({translateX(player.score, maxScore)};">
    <Avatar avatar={player.avatar} size={avatarSize} />
    <Score score={player.score} style:margin-bottom={'0.4rem'} />
  </span>
</section>
