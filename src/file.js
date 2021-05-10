/**
 * Replaces charactors in string that are illegal/unsafe for filenames.
 *
 * This is the fork of https://github.com/parshap/node-sanitize-filename
 * Original license is WTFPL, Copyright (C) 2004 Sam Hocevar.
 */

const illegalRe = /[\/\?<>\\:\*\|"]/g;
const controlRe = /[\x00-\x1f\x80-\x9f]/g;
const reservedRe = /^\.+$/;
const windowsReservedRe = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i;
const windowsTrailingRe = /[\. ]+$/;

export function sanitize(input, options) {
  const replacement = (options && options.replacement) || '';

  if (typeof input !== "string") {
    throw new Error("Input must be string");
  }

  const sanitized = input
        .replace(illegalRe, replacement)
        .replace(controlRe, replacement)
        .replace(reservedRe, replacement)
        .replace(windowsReservedRe, replacement)
        .replace(windowsTrailingRe, replacement);

  const encoder = new TextEncoder();
  const uint8 = encoder.encode(sanitized);
  const decoder = new TextDecoder();

  return decoder.decode(uint8.slice(0, 255));
}
