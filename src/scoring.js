import { GAME_CONFIG } from "./gameData.js";
export function scoreGame(results) {
  const correct = results.filter((r) => r.firstCorrect).length;
  const score = Math.round((correct / GAME_CONFIG.TOTAL_MISSIONS) * 100);
  return {
    correct,
    score,
    status: results.length === 8 ? "COMPLETE" : "IN PROGRESS",
    rank:
      score === 100
        ? "BOOTSTRAP OVERLORD"
        : score >= 75
          ? "GRID SURVIVOR"
          : score >= 50
            ? "CERTIFIED CONTAINER"
            : "BOOTSTRAP TRAINEE",
  };
}
