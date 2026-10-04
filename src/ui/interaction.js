export const playInstructions = {
  1: "Klik satu potongan kode yang menghubungkan Bootstrap.",
  2: "Klik class di bawah tiap karakter untuk memasangkannya.",
  3: "Klik blok secara berurutan; blok masuk ke slot bernomor.",
  4: "Klik satu class; bandingkan pratinjau dengan target di atasnya.",
  5: "Klik satu class untuk setiap papan teks.",
  6: "Klik satu class untuk tiap spesimen, lalu lihat perubahannya.",
  7: "Klik class untuk tiap bagian form yang diberi label.",
  8: "Klik class untuk memperbaiki setiap bagian yang diberi label.",
};
export function howTo(m, draft, locked) {
  const filled = draft.filter((v) => typeof v === "string" && v.length).length;
  return `<div class="how-to"><p><strong>CARA MAIN</strong> ${playInstructions[m.id]}</p><span>${locked ? "✓ Jawaban terkunci" : `${filled}/${m.answers.length} bagian terisi`}</span></div>`;
}
/** One non-blocking gesture demo per tab; no quiz data or answers are changed. */
let demonstrated = false;
let demoObserver;
export function demonstrateAssembly(root) {
  demoObserver?.disconnect();
  const panel = root.querySelector(".assembly-workbench");
  if (!panel || panel.disabled || panel.querySelector('[data-action="remove"]'))
    return;
  try {
    demonstrated ||=
      sessionStorage.getItem("bootstrap-seru-grid-demo") === "seen";
  } catch {}
  if (demonstrated) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  // Wait until the choices are visible on narrow screens.
  demoObserver = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      demoObserver.disconnect();
      if (!panel.isConnected) return;
      demonstrated = true;
      try {
        sessionStorage.setItem("bootstrap-seru-grid-demo", "seen");
      } catch {}
      panel.classList.add("show-click-demo");
    },
    { threshold: 0.1 },
  );
  demoObserver.observe(panel.querySelector(".assembly-list"));
}
