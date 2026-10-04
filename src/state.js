import { missions, GAME_CONFIG } from "./gameData.js";
import { validIdentity } from "./identity.js";
export const freshState = () => ({
  version: 3,
  page: "landing",
  identity: {},
  startedAt: null,
  finishedAt: null,
  results: [],
  drafts: {},
  hints: {},
  current: 1,
});
export function evaluate(mission, values) {
  return (
    Array.isArray(values) &&
    values.length === mission.answers.length &&
    mission.answers.every((a, i) => a === values[i])
  );
}
export function available(state, id) {
  return (
    validIdentity(state.identity) &&
    Number.isInteger(id) &&
    id >= 1 &&
    id <= Math.min(8, state.results.length + 1)
  );
}
export function completeDraft(mission, values) {
  return (
    Array.isArray(values) &&
    values.length === mission.answers.length &&
    values.every((v) => typeof v === "string" && v.length)
  );
}
export function submit(state, id, now = Date.now()) {
  if (!available(state, id) || id !== state.results.length + 1) return null;
  const m = missions[id - 1],
    draft = state.drafts[id] || [];
  if (!completeDraft(m, draft)) return { incomplete: true };
  const correct = evaluate(m, draft),
    previous = state.firstAttempts?.[id];
  state.firstAttempts ||= {};
  if (!previous) state.firstAttempts[id] = { values: [...draft], correct };
  if (correct) {
    state.results.push({
      id,
      values: [...draft],
      firstCorrect: state.firstAttempts[id].correct,
    });
    if (id === 8) state.finishedAt = now;
  }
  return { correct };
}
export function normalize(raw) {
  const s = freshState();
  if (!raw || raw.version !== 3 || !validIdentity(raw.identity)) return s;
  s.identity = raw.identity;
  s.startedAt =
    Number.isFinite(raw.startedAt) &&
    raw.startedAt > 0 &&
    raw.startedAt <= Date.now()
      ? raw.startedAt
      : null;
  s.drafts = {};
  s.firstAttempts = {};
  for (const m of missions) {
    const draft = raw.drafts?.[m.id];
    const allowed =
      m.blocks ||
      m.options?.map((v, i) => (m.type === "resource" ? String(i) : v));
    const validValues = (v) =>
      Array.isArray(v) &&
      v.length <= m.answers.length &&
      v.every(
        (a, i) =>
          a == null ||
          (typeof a === "string" &&
            (allowed ? allowed.includes(a) : m.fields[i]?.options.includes(a))),
      );
    if (validValues(draft)) s.drafts[m.id] = draft;
    const first = raw.firstAttempts?.[m.id];
    if (first && validValues(first.values) && completeDraft(m, first.values))
      s.firstAttempts[m.id] = {
        values: first.values,
        correct: evaluate(m, first.values),
      };
    const r = raw.results?.[m.id - 1];
    if (
      s.results.length === m.id - 1 &&
      r?.id === m.id &&
      evaluate(m, r.values) &&
      s.firstAttempts[m.id]
    ) {
      s.results.push({
        id: m.id,
        values: r.values,
        firstCorrect: s.firstAttempts[m.id].correct,
      });
      s.drafts[m.id] = r.values;
    }
  }
  if (!s.startedAt) {
    s.results = [];
    s.firstAttempts = {};
    s.drafts = {};
  }
  s.hints = Object.fromEntries(
    missions.map((m) => [m.id, raw.hints?.[m.id] === true]),
  );
  if (s.results.length === 8)
    s.finishedAt =
      Number.isFinite(raw.finishedAt) && raw.finishedAt >= s.startedAt
        ? raw.finishedAt
        : Date.now();
  s.current = available(s, raw.current)
    ? raw.current
    : Math.min(8, s.results.length + 1);
  s.page = ["landing", "identity", "mission", "result"].includes(raw.page)
    ? raw.page
    : "mission";
  if (s.page === "result" && s.results.length !== 8) s.page = "mission";
  if (s.page === "mission" && !s.startedAt) s.page = "identity";
  return s;
}
export function loadState(storage) {
  try {
    return normalize(JSON.parse(storage.getItem(GAME_CONFIG.STORAGE_KEY)));
  } catch {
    return freshState();
  }
}
export function saveState(storage, state) {
  try {
    storage.setItem(GAME_CONFIG.STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}
