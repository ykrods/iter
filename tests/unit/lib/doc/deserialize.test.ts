import { describe, test, expect } from "bun:test";

import dedent from "dedent";

import deserialize from "$src/lib/doc/deserialize"


describe("deserialize", () => {
  test("returns undefined", async() => {
    const rst = dedent`\
    =====
    foo
    =====
    `;
    expect(deserialize(rst)).toBe(undefined);
  });

  test("returns doc", async() => {
    const rst = dedent`\
    =====
    foo
    =====

    .. meta::
      :it-key: foo-key
      :it-createdAt: 946684800000
      :it-updatedAt: 946684800000
    `;


    expect(deserialize(rst)).toEqual({
      key: "foo-key",
      id: "foo-key",
      title: "",
      content: "=====\nfoo\n=====\n",
      createdAt: new Date("2000-01-01T00:00:00Z"),
      updatedAt: new Date("2000-01-01T00:00:00Z"),
    });
  });
});
