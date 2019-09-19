export function gameWinners({ teams, maxScore }) {
  let best = { score: 0, teams: [] }

  for (let p of teams) {
    if (p.score < maxScore) {
      continue
    }

    if (p.score > best.score) {
      best = { score: p.score, teams: [p] }
      continue
    }

    if (p.score === best.score) {
      best = { score: best.score, teams: [...best.teams, p] }
    }
  }

  return best
}
