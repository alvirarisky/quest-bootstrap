import { howTo } from "./interaction.js";
import { bootsy, creature } from "./characters.js";
import { esc, challenge } from "./challenges.js";
import { missions, incidentFlavor } from "../gameData.js";
import { scoreGame } from "../scoring.js";
import { elapsed, formatTime } from "../timer.js";
export const action = (text, a, secondary = false) =>
  `<button class="game-button ${secondary ? "secondary" : ""}" data-action="${a}">${text}</button>`;
function landing() {
  return `<section class="title-screen"><div class="title-copy"><span class="issue-sticker">BELAJAR BOOTSTRAP BARENG BOOTSY.</span><h1>BOOTSTRAP<br><span>SERU!</span></h1><h2>MISI BERESIN WEB</h2><p><strong>BOOTSY BUTUH BANTUANMU!</strong><br>8 misi Bootstrap seru.<br>Bantu Bootsy bikin web-nya rapi lagi.</p>${action("MULAI MISI ↗", "start")}<button class="intro-replay" data-action="intro">Kenalan lagi sama Bootsy ↻</button><div class="quick-facts"><span>8 MISI</span><span>5–10 MENIT</span><span>BARENG BOOTSY</span></div></div><div class="title-chaos"><span class="burst">CSS?<br>HILANG.</span><div class="escaped">${creature("fluid", "confused")}<code>.container ???</code></div><div class="landing-bootsy">${bootsy("panic")}</div><div class="sad-button">${creature("button", "confused")}<span>polos. pasrah.</span></div><div class="flying-input"><span class="mini-eyes"><i></i><i></i></span><code>&lt;input kabur&gt;</code></div><div class="scribble">VIRUS TANPA GAYA<br>MULAI BIKIN ULAH.</div><span class="doodle cross-one">✳</span><span class="doodle cross-two">✳</span></div></section>`;
}
function identity(s, feedback) {
  return `<section class="identity-screen"><div class="identity-character"><span class="issue-sticker">SEBELUM NGUTAK-NGATIK DIV…</span><h1>SIAPA<br>KAMU, BRAY?</h1>${bootsy("thinking")}<div class="clipboard-note">Identitas asli.<br>Situasi nggak pasti.</div></div><form id="identity-form" class="identity-form"><div class="paper-clip"></div><span class="form-kicker">DAFTAR PASUKAN BERESIN WEB</span>${[
    ["fullName", "Nama Lengkap", "Nama sesuai presensi"],
    ["nim", "NIM", "Nomor induk mahasiswa"],
    ["className", "Kelas", "Contoh: TI-24-XX"],
  ]
    .map(
      ([k, label, placeholder]) =>
        `<label for="${k}">${label}<input id="${k}" name="${k}" required maxlength="120" placeholder="${placeholder}" value="${esc(s.identity[k])}" autocomplete="${k === "fullName" ? "name" : "off"}"></label>`,
    )
    .join(
      "",
    )}<p class="rule-note">Jawaban lengkap pertama menentukan nilai. Petunjuk & coba-coba gratis. Salah? Perbaiki, lalu lanjut—nggak ada gugur.</p><button class="game-button" type="submit">AKU SIAP →</button><p role="alert" class="validation">${esc(feedback?.message || "")}</p></form></section>`;
}
function incident(s, feedback) {
  const m = missions[s.current - 1],
    f = incidentFlavor[m.id - 1],
    done = s.results.length >= m.id,
    failed = !!s.firstAttempts?.[m.id] && !done;
  const mood = done
    ? "success"
    : feedback?.message
      ? "confused"
      : s.hints[m.id]
        ? "thinking"
        : m.id === 8
          ? "shocked"
          : "idle";
  return `<section class="episode episode-${m.id} ${done ? "episode-repaired" : ""}"><div class="episode-heading"><div><span class="episode-index">INSIDEN ${String(m.id).padStart(2, "0")} / 08 <i>${f.tag}</i></span><h1>${m.label}</h1></div><div class="episode-mascot">${bootsy(mood)}<span>${done ? f.win : f.line}</span></div></div><p class="question">${m.prompt}</p>${howTo(m, s.drafts[m.id] || [], done)}${challenge(m, s.drafts[m.id] || [], done)}<div class="episode-bottom"><div class="feedback-area" role="status">${done ? `<strong class="success">${f.win}</strong><p>${m.explanation}</p>` : feedback?.message ? `<strong>${feedback.incomplete ? "BENTAR, BRAY." : "WEB-NYA MASIH AMBYAR."}</strong><p>${esc(feedback.message)}</p>` : "<strong>GILIRAN KAMU, BRAY.</strong><p>Pasang pilihanmu, lalu kirim. Petunjuk tidak mengurangi nilai.</p>"}${s.hints[m.id] ? `<p class="hint"><b>KATA BOOTSY:</b> ${m.hint}</p>` : ""}${failed ? "<small>Jawaban pertama terkunci. Perbaikan berikutnya tidak mengubah nilai.</small>" : ""}</div><div class="episode-actions">${done ? action(m.id === 8 ? "LIHAT HASILKU →" : "INSIDEN BERIKUTNYA →", m.id === 8 ? "result" : "next") : action("KIRIM JAWABAN →", "submit")}${!done ? action("BANTUIN, BOOTSY", "hint", true) : ""}${failed ? action("LIHAT PERBAIKAN", "repair", true) : ""}</div></div></section>`;
}
function result(s) {
  const score = scoreGame(s.results);
  return `<section class="result-screen"><div class="celebration-scene"><span class="issue-sticker">BOOTSTRAP SERU! SELESAI</span><h1>WEB-NYA<br><span>BERES!</span></h1><div class="celebration-bootsy">${bootsy("celebration")}</div><span class="result-spark spark-one">✳</span><span class="result-spark spark-two">✳</span><div class="clean-web"><span>● ● ● &nbsp; web-sudah-beres.html</span><div><b>halo, dunia.</b><i></i><i></i><i></i><button class="btn btn-primary" tabindex="-1">Akhirnya rapi juga.</button></div></div></div><div class="result-license"><span class="license-top">BUKTI TUNTAS MISI BOOTSTRAP</span><div class="rank-stamp">${({"BOOTSTRAP OVERLORD":"SULTAN BOOTSTRAP","GRID SURVIVOR":"JAGOAN GRID","CERTIFIED CONTAINER":"PAWANG CONTAINER","BOOTSTRAP TRAINEE":"CALON JAGOAN BOOTSTRAP"})[score.rank]}</div><dl class="identity-results"><div><dt>Nama</dt><dd>${esc(s.identity.fullName)}</dd></div><div><dt>NIM</dt><dd>${esc(s.identity.nim)}</dd></div><div><dt>Kelas</dt><dd>${esc(s.identity.className)}</dd></div></dl><div class="result-score"><span><b>${score.score}</b> / 100<small>NILAI</small></span><div><b>${score.correct} / 8</b><small>BENAR · JAWABAN PERTAMA</small><strong class="complete-status">✓ SELESAI</strong></div></div><div class="result-meta"><div><small>WAKTU PENGERJAAN</small><b>${formatTime(elapsed(s))}</b></div><div><small>INSIDEN SELESAI</small><b>8 / 8</b></div></div><p class="cosmetic-note">Julukan hanya untuk seru-seruan. Semua pemain dapat menyelesaikan kuis.</p><div class="no-print">${action("CETAK / SIMPAN HASIL ↗", "print")}</div></div></section>`;
}
export function screen(s, feedback) {
  if (s.page === "identity") return identity(s, feedback);
  if (s.page === "mission") return incident(s, feedback);
  if (s.page === "result") return result(s);
  return landing();
}
export function hud(s) {
  const score = scoreGame(s.results);
  return `<header class="game-header"><a href="#" data-action="home" class="brand"><b>B<span>!</span></b><span>BOOTSTRAP<br>SERU!</span></a>${s.startedAt ? `<div class="player-label">PEMAIN <strong>${esc(s.identity.fullName)}</strong></div><nav class="incident-progress" aria-label="Progres insiden">${missions.map((m) => `<span class="${s.results.length >= m.id ? "done" : s.current === m.id ? "current" : ""}" aria-label="Insiden ${m.id}: ${s.results.length >= m.id ? "complete" : s.current === m.id ? "current" : "locked"}">${m.id}</span>`).join("")}</nav><div class="hud-score">NILAI <b>${score.score}</b></div><time class="timer">${formatTime(elapsed(s))}</time>` : '<span class="header-caption">PRAKTIKUM PEMROGRAMAN WEB <i>BARENG BOOTSY</i></span>'}</header>`;
}
