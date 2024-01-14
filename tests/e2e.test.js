import assert from "node:assert";
import test from "node:test";

import { chromium } from "playwright";

import { server } from "../server.js";


/**
 * Fixture to provide browser
 */
async function browserFixture(test) {
  server.listen(18901);

  const browser = await chromium.launch();
  const page = await browser.newPage();
  const serverUrl = "http://127.0.0.1:18901";

  try {
    await test(browser, page, serverUrl);
  } finally {
    await browser.close();
    server.close();
  }
}

test("e2e", async (t) => {
  await browserFixture(async (browser, page, serverUrl) => {
    await page.goto(`${serverUrl}`);
    assert.strictEqual("Iter", await page.title());
  });
});
