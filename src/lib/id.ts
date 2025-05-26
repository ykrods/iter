/**
 * generate shorten time-sortable id
 *
 * unix timestamp (100ms unit) 35 bit + random 25 bit = 60 bit
 * base32 encoded 12 characters
 */
function getRandomValue(): number {
  const ary = new Uint32Array(1);
  crypto.getRandomValues(ary);
  return ary[0] & 0x1FFFFFF;// 25bit rand
}

function getTimestamp(): number {
  return Math.floor(Date.now() / 100);
}

/*
function formattedBin(v, digits) {
  return v.toString(2).padStart(digits, '0');
}
*/

function b32encode(value: number, size = 0) {
  const i2c = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

  let buf = value;
  const enc = [];

  let i = 0;
  while(0 < buf || i * 5 < size) {
    enc.push(i2c[buf & 31]);
    buf = Math.floor(buf / 32);
    i++;
  }
  return enc.toReversed().join("");
}

export function generateId() {
  const ts = getTimestamp();
  const rand = getRandomValue();
  return b32encode(ts, 35) + b32encode(rand, 25);
}
