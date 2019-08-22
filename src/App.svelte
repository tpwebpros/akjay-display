<script>
  import Board from "./Board.svelte";

  let title = "Waiting for game";

  let state = {
    maxScore: 100,
    players: [
      { name: "alice", avatar: "cactus", score: 40 },
      { name: "bob", avatar: "umbrella", score: 30 },
      { name: "charlie", avatar: "umbrella", score: 0 },
      { name: "dot", avatar: "umbrella", score: 75 },
      { name: "ev", avatar: "umbrella", score: 50 }
    ]
  };

  function gameWinner(state) {
    return state.players.reduce((winner, p) => {
      if (p.score >= state.maxScore) {
        if (!winner || p.score > winner.score) {
          return p;
        } else {
          return undefined;
        }
      } else {
        return winner;
      }
    }, undefined);
  }

  function randomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  let scoreChecker = setInterval(() => {
    const players = state.players.map(p => {
      const posNeg = randomInt(2) === 1 ? 1 : -0.5;
      const amount = randomInt(20) * posNeg;
      return {
        ...p,
        score: Math.min(100, Math.max(0, p.score + amount))
      };
    });

    update({ ...state, players });
  }, 1000);

  function update(newState) {
    let winner = gameWinner(newState);

    if (winner) {
      title = `Winner: ${winner.name}, ${winner.score} points`;
      clearInterval(scoreChecker);
      newState.gameOver = true;
    } else {
      title = "Game on";
    }

    state = newState;
  }
</script>

<style>
  h1 {
    color: purple;
  }
</style>

<h1>{title}</h1>

<Board {state} />
