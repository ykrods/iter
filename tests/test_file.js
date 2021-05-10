import { assert } from 'tiny-esm-test-runner';

const { is } = assert;

import { sanitize } from "../src/file.js";

testSanitize.parameters = [
  ["foo.txt", "foo.txt"],
  ["f/o/o.txt", "foo.txt"],
  [
    // 85 * 3 = 255, is max bytes
    Array.from({ length: 86 }, () => "あ").join(""),
    Array.from({ length: 85 }, () => "あ").join("")
  ],
];
export function testSanitize([ input, expected ]) {
  is(sanitize(input), expected);
}
