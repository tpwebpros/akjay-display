<script>
  import Board from "./Board.svelte";

  let title = "Waiting for game";

  let state = {
    maxScore: 100,
    players: [
      { name: "alice", avatar: "mushroom", score: 40 },
      { name: "bob", avatar: "squid", score: 30 },
      { name: "charlie", avatar: "taco", score: 0 },
      { name: "dot", avatar: "cactus", score: 75 },
      { name: "ev", avatar: "owl", score: 50 }
    ]
  };

  function gameWinners(state) {
    return state.players.reduce(
      (best, p) => {
        if (p.score < state.maxScore) {
          return best;
        }

        if (p.score > best.score) {
          return { score: p.score, players: [p] };
        }

        if (p.score === best.score) {
          return { score: best.score, players: [...best.players, p] };
        }

        return best;
      },
      { score: 0, players: [] }
    );
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
    let winning = gameWinners(newState);

    const winnerCount = winning.players.length;

    if (winnerCount > 0) {
      const label = winnerCount > 1 ? "Winners" : "Winner";
      title = `${label}: ${winning.players.map(p => p.name).join(", ")}, ${
        winning.score
      } points`;
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
    color: #333;
  }
</style>

<h1>{title}</h1>

<Board {state} />
