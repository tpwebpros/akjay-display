<script>
  export let name;
  import Board from "./Board.svelte";
  let state = {
    maxScore: 100,
    players: [
      { name: "alice", avatar: "umbrella", score: 40 },
      { name: "bob", avatar: "umbrella", score: 30 },
      { name: "charlie", avatar: "umbrella", score: 0 },
      { name: "dot", avatar: "umbrella", score: 75 },
      { name: "ev", avatar: "umbrella", score: 50 }
    ]
  };

  function randomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  setInterval(() => {
    const players = state.players.map(p => {
      const posNeg = randomInt(2) === 1 ? 1 : -1;
      const amount = randomInt(20) * posNeg;
      return {
        ...p,
        score: Math.min(100, Math.max(0, p.score + amount))
      };
    });

    state = { ...state, players };
    console.log(state);
  }, 1000);
</script>

<style>
  h1 {
    color: purple;
  }
</style>

<h1>Hello {name}!</h1>

<Board {state} />
