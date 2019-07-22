<script>
  export let color;
  export let count;
  export let number;
  export let player;
  export let maxScore;

  function randomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  function scorePercent(score, maxScore) {
    return Math.round((score / maxScore) * 100);
  }

  function scoreOffset(score) {
    const ems = 4;
    const offsetForWidth = (score / 100) * ems;
    return `calc(${score}% - ${offsetForWidth}em)`;
  }

  const walkSpeed = randomInt(3);
</script>

<style>
  .player {
    flex: 1;
  }

  .umbrella {
    background-image: url("media/umbrella-yellow.png");
    width: 4em;
    height: 4em;
    display: block;
    position: relative;
    background-size: 400%;
  }

  .walking-0 {
    animation: walk 0.5s steps(3) infinite;
  }

  .walking-1 {
    animation: walk 0.6s steps(3) infinite;
  }

  .walking-2 {
    animation: walk 0.7s steps(3) infinite;
  }

  @keyframes walk {
    to {
      background-position: 100% 0;
    }
  }
</style>

<section class="player" style="background-color: {color}">
  <span
    class={player.avatar}
    class:walking-0={walkSpeed === 0}
    class:walking-1={walkSpeed === 1}
    class:walking-2={walkSpeed === 2}
    style="left: {scoreOffset(player.score)}" />
  <span>{player.name}</span>
</section>
