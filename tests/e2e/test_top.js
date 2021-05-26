import { assert } from 'tiny-esm-test-runner';

import { browserTest } from "../fixtures.js";

const { is, ok } = assert;


export async function testVisit() {
  await browserTest(async (page, serverUrl) => {
    await page.goto(serverUrl);

    await page.waitForSelector('main#Top');

    is(await page.title(), 'top | iter');
  });
}

// Context: no project
// Describe: visit top page and create new project
export async function testCreateProject() {
  await browserTest(async (page, serverUrl) => {
    await page.goto(serverUrl);

    await page.waitForSelector('main#Top');
    await page.click('#openDialog');

    await page.waitForSelector("input[name='id']");
    await page.type("input[name='id']", "example");
    await page.click('#add');

    await page.waitForSelector("main#IssueList");
    ok((await page.url()).includes('/example/issues'));

    // back to top
    await page.goto(serverUrl);
    await page.waitForSelector("a[href='/example/issues']");

    await page.click("a[href='/example/issues']")
    await page.waitForSelector("main#IssueList");
    ok((await page.url()).includes('/example/issues'));
  });
}
