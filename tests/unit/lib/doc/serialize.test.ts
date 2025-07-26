import { describe, test, expect } from "bun:test";

import dedent from "dedent";

import serialize from "$src/lib/doc/serialize"


describe("serialize", () => {
  test("returns undefined", async() => {
    const doc = {
      key: "foo-key",
      id: "foo-key",
      title: "foo-title",
      content: "=====\nfoo\n=====\n",
      createdAt: new Date("2000-01-01T00:00:00Z"),
      updatedAt: new Date("2000-01-01T00:00:00Z"),
    };
    const expected = dedent`\
      =====
      foo
      =====

      .. meta::
        :it-key: foo-key
        :it-title: foo-title
        :it-createdAt: 946684800000
        :it-updatedAt: 946684800000
      `;
    expect(serialize(doc)).toBe(expected);
  });
});
