<script>
  export let color;
  export let count;
  export let number;
  export let player;
</script>

<style>
  /* .players-1 {
    height: 100%;
  }

  .players-2 {
    height: 50%;
  }

  .players-3 {
    height: 33.33333%;
  }

  .players-4 {
    height: 25%;
  }

  .players-5 {
    height: 20%;
  } */
  .player {
    flex: 1;
  }
</style>

<section class="player" style="background-color: {color}">
  <span>{player.name}</span>
</section>
