export function elapsed(state, now = Date.now()) {
  return state.startedAt
    ? Math.max(0, (state.finishedAt || now) - state.startedAt)
    : 0;
}
export function formatTime(ms) {
  const s = Math.floor(ms / 1000);
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}
