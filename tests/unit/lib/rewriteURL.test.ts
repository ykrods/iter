import { describe, test, expect } from "bun:test";

import { rewriteURL, rewriteImageURL } from "$src/lib/rewriteHTML";


describe("rewriteURL", () => {
  test.each([
    ["https://example.com"],
    ["http://example.com"],
  ])("keep external url: %s", (url) => {
    const result = rewriteURL(url, {});
    expect(result).toEqual(url);
  });

  test("keep fragment", () => {
    const url = "#foo";
    const result = rewriteURL(url, {});
    expect(result).toEqual(url);
  });

  test("resolve relative url based on key", () => {
    const options = {
      origin: "http://localhost",
      project: "proj-a",
      key: "docs/foo.rst",
    };
    expect(
      rewriteURL("bar.rst", options)
    ).toEqual("/proj-a/docs/bar.rst");
  });
});

describe("rewriteImageURL", () => {
  test.each([
    ["https://example.com/img.png"],
    ["http://example.com/img.png"],
  ])("keep external url: %s", (url) => {
    const result = rewriteImageURL(url, {});
    expect(result).toEqual(url);
  });

  test("resolve relative url based on key", () => {
    const options = {
      origin: "http://localhost",
      project: "proj-a",
      key: "docs/index.rst",
    };
    expect(
      rewriteImageURL("image.png", options)
    ).toEqual("/raw/proj-a/docs/image.png");
  });
});
