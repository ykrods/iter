import  puppeteer from 'puppeteer';

import { server } from '../server.js';

/**
 * Fixture to provide browser
 */
export async function browserTest(test) {
  server.listen(18901);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.setDefaultTimeout(500);

  const serverUrl = "http://127.0.0.1:18901";

  try {
    await test(page, serverUrl, browser);
  } finally {
    await browser.close();
    server.close();
  }
}

export async function project(page, serverUrl, name) {
    await page.goto(serverUrl);

    await page.waitForSelector('main#Top');
    await page.click('#openDialog');

    await page.waitForSelector("input[name='id']");
    await page.type("input[name='id']", name);
    await page.click('#add');

    await page.waitForSelector("main#IssueList");
}
