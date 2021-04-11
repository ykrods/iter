// XXX: puppeteer 3.0.0 ~ 8.0.0 does not work on macOS Catalina, node 14.0.0
import  puppeteer from 'puppeteer';

import { server } from '../server.js';

/**
 * Fixture to provide browser
 */
export async function browserFixture(test) {
  server.listen(18901);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setDefaultTimeout(500);

  const serverUrl = "http://127.0.0.1:18901";

  try {
    await test(browser, page, serverUrl);
  } finally {
    await browser.close();
    server.close();
  }
}
