import { creature, boss } from "./characters.js";
export const esc = (v) =>
  String(v ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const chips = (options, index, d, resource = false) =>
  `<div class="option-list ${resource ? "code-modules" : ""}">${options
    .map((v, i) => {
      const value = resource ? String(i) : v;
      return `<button class="choice-chip ${d[index] === value ? "selected" : ""}" data-action="choose" data-index="${index}" data-value="${esc(value)}" aria-pressed="${d[index] === value}">${resource ? `<span class="module-plug">${String(i + 1).padStart(2, "0")} / HUBUNGKAN</span><code>${esc(v)}</code>` : esc(v)}</button>`;
    })
    .join("")}</div>`;
const partNames = {
  7: [
    "INPUT · class pada input",
    "BARIS · pembungkus form",
    "LABEL · lebar kolom",
    "INPUT · lebar kolom",
  ],
  8: [
    "LAYOUT · pembungkus",
    "LAYOUT · baris",
    "RESPONSIF · kolom",
    "TEKS · judul",
    "FORM · input",
    "BUTTON · tombol",
  ],
};
const field = (m, d, i, art = "") =>
  `<section class="match-row ${d[i] ? "has-selection" : ""}" role="group" aria-labelledby="part-${m.id}-${i}"><h3 id="part-${m.id}-${i}">${partNames[m.id]?.[i] || m.fields[i].label}</h3>${art}<div class="field-options"><span class="control-label">${m.id === 5 ? "PILIH CLASS UNTUK PAPAN INI" : m.id === 2 ? "PILIH CLASS UNTUK KARAKTER INI" : "PILIH SATU CLASS"}</span>${chips(m.fields[i].options, i, d)}</div>${m.id >= 7 ? `<code class="installed-class">class="${esc(d[i] || "… pilih di atas …")}"</code>` : ""}</section>`;
const eyes = '<span class="mini-eyes"><i></i><i></i></span>';
function devices(d) {
  const n = (d[0] || "col-12 col-md-12").match(/\d+/g).map(Number);
  return `<div class="device-pair">${["PONSEL · 390px", "KOMPUTER · 1024px"].map((label, i) => `<div class="device"><div class="device-label">${label}</div><div class="layout-box" style="grid-template-columns:repeat(${12 / n[i]},1fr)">${Array.from({ length: 6 }, (_, k) => `<div class="column-creature">${eyes}<b>${k + 1}</b><span class="tiny-mouth"></span></div>`).join("")}</div></div>`).join("")}</div>`;
}
function liveForm(d) {
  return `<div class="form-patient ${d[0] === "form-control" ? "calmed" : "wild"}">${eyes}<div class="live-preview"><div class="${esc(d[1] || "")}"><label class="${esc(d[2] || "")}" for="patient">Nama</label><div class="${esc(d[3] || "")}"><input tabindex="-1" id="patient" class="${esc(d[0] || "")}" placeholder="Aku mau kabur dulu" readonly></div></div></div><span class="patient-feet">╱ ╲</span></div>`;
}
function livePanel(d) {
  return `<div class="live-preview final-preview"><div class="${esc(d[0] || "")}"><div class="${esc(d[1] || "")}"><div class="${esc(d[2] || "")}"><h3 class="${esc(d[3] || "")}">Layanan web</h3><label for="service">Permintaan</label><input tabindex="-1" id="service" readonly placeholder="Beresin web-nya" class="${esc(d[4] || "")}"><button type="button" class="${esc(d[5] || "")}" tabindex="-1" aria-disabled="true">Kirim</button></div></div></div></div>`;
}
export function challenge(m, d, locked) {
  const mood = locked ? "success" : "confused";
  let html = "";
  if (m.id === 1)
    html = `<div class="incident-stage connection-scene"><div class="webpage-patient ${locked ? "styled" : ""}"><div class="fake-browser">● ● ● <span>web-katanya-normal.html</span></div>${creature("page", mood)}<div class="patient-content"><strong>${locked ? "Halo, web yang rapi." : "polos dan pasrah"}</strong><button class="${locked ? "btn btn-primary" : ""}" tabindex="-1" aria-disabled="true">${locked ? "Sekarang pede dong" : "tombol sedih"}</button></div></div><fieldset ${locked ? "disabled" : ""}><legend class="control-label">PILIH 1 KODE UNTUK HALAMAN INI</legend>${chips(m.options, 0, d, true)}</fieldset></div>`;
  if (m.id === 2)
    html = `<fieldset class="incident-stage container-scene" ${locked ? "disabled" : ""}>${m.fields.map((f, i) => `<section class="container-match"><span class="target-label">TARGET ${i + 1}</span><div class="character-caption">${i ? "BUAT APA ADA BATAS?" : "JANGAN LEWAT BATAS."}</div><div class="boundary-stage ${i ? "stretchy" : "bounded"}">${creature(i ? "fluid" : "box", mood)}</div><div class="match-controls">${field(m, d, i)}</div></section>`).join("")}</fieldset>`;
  if (m.id === 3) {
    const ready =
      d.length === m.answers.length && d.every((v, i) => v === m.answers[i]);
    html = `<div class="incident-stage grid-scene"><div class="grid-theatre"><div class="twins ${ready ? "placed" : ""}">${creature("twin", ready ? "success" : "confused", "KEMBAR A")}${creature("twin", ready ? "success" : "confused", "KEMBAR B")}</div><div class="row-track"><span>ROW</span><div class="grid-slots">${Array.from({ length: 12 }, (_, i) => `<b>${i + 1}</b>`).join("")}</div></div><p>12 unit. Dua saudara. Sama-sama nggak mau ngalah.</p></div><fieldset class="assembly-workbench" ${locked ? "disabled" : ""}><legend class="control-label">HASIL SUSUNAN · ISI SESUAI NOMOR</legend><div class="assembly-slots">${m.answers.map((_, i) => (d[i] ? `<button class="filled-slot" data-action="remove" data-index="${i}" aria-label="Lepas blok ${i + 1}: ${esc(d[i])}"><span>${i + 1}</span><code>${esc(d[i])}</code><b aria-hidden="true">×</b></button>` : `<div class="empty-slot ${i === d.length ? "next-slot" : ""}"><span>${i + 1}</span><span>${i === d.length ? "Blok berikutnya masuk ke sini" : "Slot kosong"}</span></div>`)).join("")}</div><div class="assembly-demo" aria-hidden="true"><span>① Klik blok</span><b>↖</b><span>② Otomatis masuk slot</span></div><p class="control-label">PILIHAN BLOK · KLIK UNTUK MEMASANG ↓</p><div class="assembly-list">${m.blocks
      .map((v, i) => {
        const used = d.filter((x) => x === v).length,
          occ = m.blocks.slice(0, i + 1).filter((x) => x === v).length;
        return `<button class="assembly-chip" data-action="add" data-value="${esc(v)}" ${used >= occ ? "disabled" : ""}>${esc(v)}</button>`;
      })
      .join(
        "",
      )}</div><small>Salah urutan? Klik × pada blok terpasang untuk melepasnya.</small></fieldset></div>`;
  }
  if (m.id === 4)
    html = `<div class="incident-stage responsive-scene"><div class="responsive-target"><strong>TARGET TETAP</strong><span>PONSEL: 2 kolom per baris <i class="target-columns two" aria-hidden="true"></i></span><span>KOMPUTER: 3 kolom per baris <i class="target-columns three" aria-hidden="true"></i></span></div><span class="control-label">PRATINJAU PILIHANMU${d[0] ? "" : " · BELUM ADA CLASS"}</span>${devices(d)}<fieldset ${locked ? "disabled" : ""}><legend class="control-label">PILIH 1 KOMBINASI CLASS</legend>${chips(m.options, 0, d)}</fieldset></div>`;
  if (m.id === 5)
    html = `<div class="incident-stage typography-scene"><div class="goblin-stage">${creature("goblin", mood)}<span class="speech-sticker">aku ngetik, maka aku ribut</span></div><fieldset class="sign-wall" ${locked ? "disabled" : ""}>${m.fields.map((f, i) => field(m, d, i, `<div class="sign ${d[i] ? "paired" : ""} ${locked ? "illuminated" : ""}" style="${f.style}">${esc(f.sample)}</div>`)).join("")}</fieldset></div>`;
  if (m.id === 6)
    html = `<fieldset class="incident-stage lab-scene" ${locked ? "disabled" : ""}>${m.fields
      .map((f, i) => {
        const demos = [
          `<table class="table ${esc(d[0] || "").replace(/^table /, "")}"><thead><tr><th>Spesimen</th><th>ID</th></tr></thead><tbody><tr><td>Goblin</td><td>01</td></tr><tr><td>Raja tanpa gaya</td><td>02</td></tr><tr><td>Bootsy</td><td>03</td></tr></tbody></table>`,
          `<button class="${esc(d[1] || "")}" tabindex="-1" aria-disabled="true">Selamatkan aku</button>`,
          `<img class="${esc(d[2] || "")}" src="/specimen.svg" alt="Karakter gambar berasio dua banding satu">`,
        ];
        return `<section class="lab-machine"><span class="lab-label">SPESIMEN 0${i + 1} / ${["TABEL", "TOMBOL", "GAMBAR"][i]}</span><div class="specimen-pair">${creature(["table", "button", "image"][i], d[i] ? "success" : "confused")}<div class="mutation-output">${demos[i]}</div></div>${field(m, d, i)}</section>`;
      })
      .join("")}</fieldset>`;
  if (m.id === 7)
    html = `<div class="incident-stage form-scene"><div class="form-theatre"><div class="warning-label">AWAS, INPUT KABUR</div>${liveForm(d)}<code>&lt;input class="${esc(d[0] || "_____")}"&gt;</code><p>Pratinjau mengikuti lebar layar.</p></div><fieldset class="repair-console" ${locked ? "disabled" : ""}>${m.fields.map((f, i) => field(m, d, i)).join("")}</fieldset></div>`;
  if (m.id === 8)
    html = `<div class="incident-stage boss-scene"><div class="boss-theatre">${boss(locked, d.filter((v, i) => v === m.answers[i]).length)}<div class="armor-meter" aria-label="Bagian terpasang">${m.answers.map((a, i) => `<i class="${d[i] === a ? "active" : ""}"></i>`).join("")}</div>${livePanel(d)}</div><fieldset class="boss-modules" ${locked ? "disabled" : ""}>${m.fields.map((f, i) => field(m, d, i)).join("")}</fieldset></div>`;
  return html;
}
