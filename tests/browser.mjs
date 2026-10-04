// Run with Playwright installed in the test environment:
// npm install --no-save --package-lock=false playwright
// BASE_URL=http://127.0.0.1:5173 node tests/browser.mjs
// Uses an installed Google Chrome; no production dependency is required.
import { chromium } from "playwright";
import assert from "node:assert/strict";
import { missions } from "../src/gameData.js";
const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  for (const [width, height] of [
    [1366, 768],
    [1440, 900],
    [390, 844],
  ]) {
    const page = await browser.newPage({ viewport: { width, height } }),
      errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const click = (action) => page.locator(`[data-action="${action}"]`).click();
    await page.goto(process.env.BASE_URL || "http://127.0.0.1:5173");
    if (await page.locator(".bootsy-intro").count()) await page.locator("[data-intro-close]").first().click();
    await click("start");
    await page.locator("button[type=submit]").click();
    assert.equal(await page.locator("#identity-form").count(), 1);
    for (const [name, value] of Object.entries({
      fullName: "QA Student",
      nim: "TEST-05",
      className: "TI-2A",
    }))
      await page.locator(`#${name}`).fill(value);
    await page.locator("button[type=submit]").click();
    for (const m of missions) {
      assert.equal(
        await page.locator(".episode-heading h1").innerText(),
        m.label,
      );
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        true,
        `Incident ${m.id} overflow at ${width}`,
      );
      if (m.id === 1) {
        await page.locator('[data-value="0"]').click();
        await click("submit");
        await click("hint");
        await page.reload();
        assert.equal(await page.locator(".hint").count(), 1);
        await click("repair");
      } else {
        if (m.blocks) {
          for (const value of m.answers)
            await page
              .locator("[data-action=add]:not(:disabled)")
              .filter({ hasText: value })
              .first()
              .click();
        } else
          for (let i = 0; i < m.answers.length; i++) {
            const locator = page.locator(
              `[data-action=choose][data-index="${i}"]`,
            );
            const index = await locator.evaluateAll(
              (els, value) => els.findIndex((el) => el.dataset.value === value),
              m.answers[i],
            );
            assert.ok(index >= 0);
            await locator.nth(index).click();
          }
        if (m.id === 4) {
          await page.reload();
          assert.equal(
            await page.locator(".choice-chip.selected").innerText(),
            m.answers[0],
          );
        }
        await click("submit");
      }
      assert.equal(await page.locator("fieldset:disabled").count(), 1);
      await click(m.id === 8 ? "result" : "next");
    }
    const result = await page.locator(".result-license").innerText();
    assert.match(result, /88/);
    assert.match(result, /SELESAI/);
    assert.match(result, /QA Student/);
    const time = await page.locator(".timer").innerText();
    await page.reload();
    assert.equal(await page.locator(".timer").innerText(), time);
    if (width >= 1000)
      assert.ok(
        await page
          .locator(".result-license")
          .evaluate((el) => el.getBoundingClientRect().bottom <= innerHeight),
      );
    assert.deepEqual(errors, []);
    await page.close();
    console.log(
      `PASS ${width}×${height}: full flow, first-attempt scoring, hints, repair, reload, locking, result, timer, no overflow/page errors`,
    );
  }
} finally {
  await browser.close();
}
