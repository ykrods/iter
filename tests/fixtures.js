import  puppeteer from 'puppeteer';

import { server } from '../server.js';

/**
 * Fixture to provide browser
 */
export async function browserFixture(test) {
  server.listen(18901);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.setDefaultTimeout(500);

  const serverUrl = "http://127.0.0.1:18901";

  try {
    await test(browser, page, serverUrl);
  } finally {
    await browser.close();
    server.close();
  }
}
