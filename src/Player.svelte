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
    const margin = 1;
    const offsetForWidth = (score / 100) * width;
    const offsetForMargin = (score / 100) * margin;
    return `calc(${score}vw - ${offsetForMargin}em - ${offsetForWidth}em)`;
  }

  const walkSpeed = randomInt(3);
</script>

<style>
  .player {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .player .name {
    margin: 0.5em;
  }

  .avatar {
    transition: transformX 0.5s ease;
    width: 4em;
    height: 4em;
    display: block;
    position: relative;
  }

  .avatar.umbrella {
    background-image: url("media/umbrella-yellow.png");
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
  <span class="name">{player.name}</span>
  <span
    class={`avatar ${player.avatar}`}
    class:walking-0={!gameOver && walkSpeed === 0}
    class:walking-1={!gameOver && walkSpeed === 1}
    class:walking-2={!gameOver && walkSpeed === 2}
    style={`transform: translateX(${translateX(player.score, maxScore)});`} />
</section>
