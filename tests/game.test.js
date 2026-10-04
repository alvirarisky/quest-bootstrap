import test from "node:test";
import assert from "node:assert/strict";
import { missions, GAME_CONFIG } from "../src/gameData.js";
import {
  freshState,
  normalize,
  submit,
  available,
  loadState,
  saveState,
  evaluate,
} from "../src/state.js";
import { scoreGame } from "../src/scoring.js";
import { elapsed, formatTime } from "../src/timer.js";
import { validIdentity } from "../src/identity.js";
const player = () => ({
  ...freshState(),
  identity: { fullName: "Test Builder", nim: "TEST-001", className: "Lab A" },
  startedAt: Date.now() - 60000,
  page: "mission",
});
test("identity and mission prerequisites block direct entry", () => {
  assert.equal(
    validIdentity({ fullName: " ", nim: "1", className: "A" }),
    false,
  );
  assert.equal(available(freshState(), 1), false);
  const s = player();
  assert.equal(available(s, 2), false);
  assert.equal(submit(s, 8), null);
  s.page = "result";
  assert.equal(normalize(s).page, "mission");
});
test("incomplete submissions do not consume first attempt", () => {
  const s = player();
  s.drafts[2] = [];
  assert.deepEqual(submit(s, 1), { incomplete: true });
  assert.equal(s.firstAttempts, undefined);
});
test("all eight missions solvable, score 100, locked answers and fixed timer", () => {
  let s = player();
  const finish = Date.now();
  for (const m of missions) {
    assert.equal(available(s, m.id), true);
    s.current = m.id;
    s.page = "mission";
    s.drafts[m.id] = [...m.answers];
    assert.equal(submit(s, m.id, finish).correct, true);
    assert.equal(submit(s, m.id, finish), null);
    s = normalize(JSON.parse(JSON.stringify(s)));
    assert.equal(s.results.length, m.id);
  }
  assert.deepEqual(scoreGame(s.results), {
    correct: 8,
    score: 100,
    status: "COMPLETE",
    rank: "BOOTSTRAP OVERLORD",
  });
  assert.equal(elapsed(s, finish + 90000), elapsed(s, finish));
  assert.equal(formatTime(elapsed(s)), "01:00");
});
test("wrong first answer stays locked after repair and refresh", () => {
  let s = player();
  s.drafts[1] = ["0"];
  assert.equal(submit(s, 1).correct, false);
  s = normalize(s);
  s.drafts[1] = missions[0].answers;
  assert.equal(submit(s, 1).correct, true);
  assert.equal(s.firstAttempts[1].values[0], "0");
  assert.equal(s.results[0].firstCorrect, false);
  assert.equal(scoreGame(s.results).score, 0);
});
test("mixed results score normalized, rank cosmetic, no failing status", () => {
  const results = Array.from({ length: 8 }, (_, i) => ({
    firstCorrect: i < 6,
  }));
  assert.deepEqual(scoreGame(results), {
    correct: 6,
    score: 75,
    status: "COMPLETE",
    rank: "GRID SURVIVOR",
  });
  assert.equal(scoreGame(results.slice(0, 5)).status, "IN PROGRESS");
});
test("malformed, out of order, and forged result flags rejected", () => {
  const s = player();
  s.results = [{ id: 8, values: missions[7].answers, firstCorrect: true }];
  assert.equal(normalize(s).results.length, 0);
  s.results = [];
  s.drafts[1] = ["0"];
  submit(s, 1);
  s.drafts[1] = ["1"];
  submit(s, 1);
  s.results[0].firstCorrect = true;
  s.firstAttempts[1].correct = true;
  assert.equal(normalize(s).results[0].firstCorrect, false);
  assert.equal(loadState({ getItem: () => "{" }).page, "landing");
  assert.equal(
    saveState(
      {
        setItem: () => {
          throw Error();
        },
      },
      s,
    ),
    false,
  );
});
test("storage round trip preserves drafts, hints, and results", () => {
  let serialized;
  const storage = {
    setItem: (k, v) => {
      assert.equal(k, GAME_CONFIG.STORAGE_KEY);
      serialized = v;
    },
    getItem: () => serialized,
  };
  const s = player();
  s.drafts[1] = ["1"];
  s.hints[1] = true;
  submit(s, 1);
  assert.equal(saveState(storage, s), true);
  const restored = loadState(storage);
  assert.deepEqual(restored.results, s.results);
  assert.equal(restored.hints[1], true);
});
test("assembly requires valid nesting, finite blocks, and exact target order", () => {
  const m = missions[2];
  assert.equal(evaluate(m, m.answers), true);
  const wrong = [...m.answers];
  [wrong[0], wrong[1]] = [wrong[1], wrong[0]];
  assert.equal(evaluate(m, wrong), false);
  assert.equal(evaluate(m, [...m.answers, "</div>"]), false);
});

test("zero score still completes all eight incidents", () => {
  const s = player();
  for (const m of missions) {
    s.drafts[m.id] = m.answers.map(() => "wrong");
    assert.equal(submit(s, m.id).correct, false);
    s.drafts[m.id] = [...m.answers];
    submit(s, m.id);
  }
  assert.equal(s.results.length, 8);
  assert.deepEqual(scoreGame(s.results), {
    correct: 0,
    score: 0,
    status: "COMPLETE",
    rank: "BOOTSTRAP TRAINEE",
  });
});
