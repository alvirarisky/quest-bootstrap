import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";
import { missions } from "./gameData.js";
import { loadState, saveState, submit, available } from "./state.js";
import { validIdentity, readIdentity } from "./identity.js";
import { elapsed, formatTime } from "./timer.js";
import { screen, hud } from "./ui/screens.js";
import { shouldIntroduce, showBootsyIntro } from "./ui/intro.js";
const app = document.querySelector("#app");
let storage;
try {
  storage = window.localStorage;
} catch {}
let state = loadState(storage),
  feedback = null,
  notice = "";
function persist() {
  if (!saveState(storage, state))
    notice =
      "Progress tidak dapat disimpan di browser ini. Tetap buka halaman hingga selesai.";
}
function render() {
  if (
    ["mission", "result"].includes(state.page) &&
    !validIdentity(state.identity)
  )
    state.page = "identity";
  if (state.page === "result" && state.results.length !== 8)
    state.page = "mission";
  if (state.page === "mission" && !available(state, state.current))
    state.current = Math.min(8, state.results.length + 1);
  app.innerHTML = `<div class="game-shell page-${state.page}">${hud(state)}<main>${screen(state, feedback)}</main>${notice ? `<p role="alert" class="storage-warning">${notice}</p>` : ""}<footer><span>BELAJAR BOOTSTRAP, SATU MISI SEKALIGUS.</span><span>MISI BERESIN WEB / BARENG BOOTSY</span></footer></div>`;
  app.querySelector("#identity-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const identity = readIdentity(e.target);
    state.identity = identity;
    if (!validIdentity(identity)) {
      feedback = {
        message: "Isi Nama, NIM, dan Kelas. Spasi saja tidak cukup.",
      };
      render();
      return;
    }
    state.identity = identity;
    state.startedAt ||= Date.now();
    state.page = "mission";
    feedback = null;
    persist();
    render();
    window.scrollTo(0, 0);
  });
}
app.addEventListener("click", (e) => {
  const b = e.target.closest("[data-action]");
  if (!b || b.disabled || b.closest("fieldset:disabled")) return;
  e.preventDefault();
  if (b.dataset.action === "intro") { showBootsyIntro(); return; }
  const { action: a, index, value } = b.dataset,
    m = missions[state.current - 1];
  const editable =
    state.page === "mission" &&
    available(state, state.current) &&
    state.current === state.results.length + 1;
  if (["choose", "add", "remove", "submit", "repair"].includes(a) && !editable)
    return;
  if (a === "start" || a === "home")
    state.page = state.startedAt
      ? state.results.length === 8
        ? "result"
        : "mission"
      : "identity";
  if (a === "choose") {
    const d = state.drafts[state.current] || Array(m.answers.length).fill(null);
    if (
      (
        m.options?.map((v, i) => (m.type === "resource" ? String(i) : v)) ||
        m.fields?.[Number(index)]?.options ||
        []
      ).includes(value)
    ) {
      d[Number(index)] = value;
      state.drafts[state.current] = d;
    }
  }
  if (a === "add") {
    const d = state.drafts[state.current] || [];
    if (
      d.length < m.blocks.length &&
      d.filter((v) => v === value).length <
        m.blocks.filter((v) => v === value).length
    )
      d.push(value);
    state.drafts[state.current] = d;
  }
  if (a === "remove") state.drafts[state.current]?.splice(Number(index), 1);
  if (a === "hint") state.hints[state.current] = true;
  feedback = null;
  if (a === "repair" && state.firstAttempts?.[state.current]) {
    state.drafts[state.current] = [...m.answers];
    submit(state, state.current);
  }
  if (a === "submit") {
    const r = submit(state, state.current);
    if (!r?.correct)
      feedback = {
        incomplete: r?.incomplete,
        message: r?.incomplete
          ? "Lengkapi semua bagian sebelum mengirim jawaban."
          : `${m.hint} Coba perbaiki atau lihat perbaikan setelah jawaban pertama terkunci.`,
      };
  }
  if (a === "next" && state.results.length >= state.current) {
    state.current = Math.min(8, state.current + 1);
    state.page = "mission";
  }
  if (a === "result" && state.results.length === 8) state.page = "result";
  if (a === "print") {
    window.print();
    return;
  }
  persist();
  render();
  if (["choose", "add", "remove", "hint"].includes(a)) {
    const replacement = [...app.querySelectorAll("[data-action]")].find(
      (el) =>
        el.dataset.action === a &&
        el.dataset.index === index &&
        el.dataset.value === value &&
        !el.disabled,
    );
    replacement?.focus({ preventScroll: true });
  } else if (["submit", "repair"].includes(a)) {
    app
      .querySelector(".episode-bottom")
      ?.scrollIntoView({ block: "nearest", behavior: "instant" });
  } else {
    window.scrollTo(0, 0);
    const h = app.querySelector("h1");
    h?.setAttribute("tabindex", "-1");
    h?.focus({ preventScroll: true });
  }
});
window.addEventListener("storage", () => {
  state = loadState(storage);
  feedback = null;
  render();
});
setInterval(() => {
  const el = app.querySelector(".timer");
  if (el) el.textContent = formatTime(elapsed(state));
}, 1000);
render();

if (shouldIntroduce(state.page)) showBootsyIntro();
