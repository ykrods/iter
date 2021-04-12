import { assert } from 'tiny-esm-test-runner';

import { browserFixture } from "./fixtures.js";

const { is, isNot, ok, ng } = assert;


export async function testVisit() {
  await browserFixture(async (browser, page, serverUrl) => {
    await page.goto(serverUrl);

    await page.waitForSelector('main#Top');

    is(await page.title(), 'top | iter');
  });
}

// Context: no project
// Describe: visit top page and create new project
export async function testCreateProject() {
  await browserFixture(async (browser, page, serverUrl) => {
    await page.goto(serverUrl);

    await page.waitForSelector('main#Top');
    await page.click('#openDialog');

    await page.waitForSelector("input[name='id']");
    await page.type("input[name='id']", "example");
    await page.click('#add');

    await page.waitForSelector("main#Journal");
    ok((await page.url()).includes('/example'));

    // back to top
    await page.goto(serverUrl);
    await page.waitForSelector("a[href='/example']");

    await page.click("a[href='/example']")
    await page.waitForSelector("main#Journal");
    ok((await page.url()).includes('/example'));
  });
}
