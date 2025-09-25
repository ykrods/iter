import { describe, test, expect } from "bun:test";

import generateId from "$src/lib/generateId";


describe("generateId", () => {
  test("returns id", async() => {
    const id = generateId()
    expect(id).toMatch(/^[0-9A-HJKMNP-TV-Z]{12}$/);
  });

  test("shuld be unique", async() => {
    const size = 32;
    const results = [...Array(size)].map(() => generateId());
    expect(new Set(results).size).toBe(size);
  });
});
