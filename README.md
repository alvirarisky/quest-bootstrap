# Bootstrap Seru! — Misi Beresin Web

Nama dan antarmuka permainan kini memakai **Bootstrap Seru!**, dengan teks utama berbahasa Indonesia. Nama class Bootstrap tetap asli. Kunci penyimpanan lama sengaja dipertahankan agar progres pemain tidak hilang.

A short cartoon Bootstrap quiz for Web Programming practicum. Vite + Bootstrap 5 + vanilla JavaScript; all characters and scene assets are local SVG/DOM.

## Run

- `npm install`
- `npm run dev`
- `npm test`
- `npm run check` (syntax checks; no linter is configured)
- `npm run build`
- `npm run preview`

## Experience

Intro → required identity → eight incidents directly → screenshot-ready result. No city map, RPG, sound dependency, or long briefing.

1. **CDN Chaos** — select a stylesheet connection module; the plain webpage gains styling.
2. **Container Escaped** — match bounded and full-width creatures.
3. **The 12-Column Incident** — click-to-assemble HTML around the col-6 twins and a numbered 12-unit row; click a placed block to remove it.
4. **Responsive Shapeshifter** — choose responsive classes and see six characters rearrange in mobile/desktop previews.
5. **Typography Goblin** — match four utility classes to fixed visual text targets.
6. **Component Mutation Lab** — transform a table, button, and image through three quick selections.
7. **Form Control Freakout** — tame a running input and repair horizontal form structure.
8. **The Unstyled One** — assemble six Bootstrap modules, remove boss armor, and rebuild a responsive panel.

Bootsy is an original B-shaped SVG character with idle, confused, panic, thinking, success, shocked, and celebration states. The cast includes container creatures, twins, a typography goblin, component specimens, and a webpage boss. Animations respect reduced motion.

## Assessment rules

Exactly eight scored incidents. The first **complete committed answer** determines correctness for each incident. Each incident is all-or-nothing, including its subparts. Final score is `round(correct / 8 * 100)`. Draft experimentation, hints, and time never deduct points.

Wrong answers stay recorded. Students may retry or choose **Show Repair** after committing an incorrect answer. Show Repair installs the valid solution and lets them continue without changing the first-attempt score. All students can finish, even with score zero.

Final status is **COMPLETE**. Rank is cosmetic: 100 = Bootstrap Overlord; 75–99 = Grid Survivor; 50–74 = Certified Container; below 50 = Bootstrap Trainee. No failing status or game over.

The timer starts after identity submission, includes time away from the tab, and freezes on completion of incident 8. Final result includes identity, correct/total, score, completion status, rank, elapsed time, and completed incidents. Browser printing is available.

## Structure

- `src/gameData.js`: structured incident content, choices, answers, hints, and short reactions.
- `src/state.js`: prerequisite checks, submissions, drafts, first-attempt locking, validation, persistence.
- `src/scoring.js`, `src/timer.js`, `src/identity.js`: isolated logic.
- `src/ui/characters.js`: local SVG character cast and expressions.
- `src/ui/challenges.js`: eight interactive visual scenes.
- `src/ui/screens.js`: intro, identity, HUD, feedback, final result.
- `src/main.js`: lifecycle and event handling.
- `src/style.css`: complete cartoon presentation, responsive layout, print, reduced motion.
- `public/specimen.svg`: responsive-image practice asset.
- `tests/game.test.js`: scoring, prerequisite, persistence, timer, invalid state, and completion regression tests.

## Persistence and limits

Uses a new `bootstrap-brainrot-v1` localStorage key, separate from the discontinued Bootstrap Builder. Stores identity, drafts, initial submissions, completed incidents, hints, active incident, and timestamps. Refresh restores progress and cannot reroll a committed answer through normal UI. Incoming storage changes are synchronized between tabs. Stored outcomes are recalculated from answers and checked for sequential progression.

This is a client-only practicum activity, not a trusted server-side examination system. DevTools, clearing storage, and changing the device clock remain outside basic protection. Results are not sent to Google Forms or an LMS.

**Modul 5 was not present in the repository or available attachments.** Content follows the introductory topics explicitly listed in the request and the installed Bootstrap 5 implementation. Exact module alignment needs verification when the module is supplied; no advanced Bootstrap components are assessed.

## QA

Logic tests include all eight solvable incidents, mixed scores, first-attempt locking across refresh, malformed state, frozen completion time, and zero-score completion. Browser QA covers the full interaction flow at 1366×768 and 1440×900, plus mobile overflow checks. Screenshot inspection is performed for intro, identity, all eight incidents, and results.
## Perkenalan Bootsy

Saat membuka halaman awal pada sesi tab baru, Bootsy memperkenalkan diri lewat tiga adegan singkat (masuk, panik, lalu mengajak bermain). Tersedia Lewati Perkenalan, Escape, dan Kenalan Lagi. Intro tidak memulai timer atau mengubah nilai. Pengaturan reduced motion menampilkan perkenalan statis. Label halaman memakai Bareng Bootsy dan Misi Beresin Web.
