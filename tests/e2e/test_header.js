import { assert } from 'tiny-esm-test-runner';

import { browserTest, project } from "../fixtures.js";

const { ok } = assert;


export async function testHeader() {
  await browserTest(async (page, serverUrl) => {
    await project(page, serverUrl, "example");

    ok(await page.$(`a[href="/example/notes"]`));
    ok(await page.$(`a[href="/example/issues"]`));
    ok(await page.$(`a[href="/example/wiki/"]`));
    ok(await page.$(`a[href="/example/files"]`));
    ok(await page.$("#create-note-button"));
    ok(await page.$("#search-button"));
    ok(await page.$("#settings-button"));
  });
}
