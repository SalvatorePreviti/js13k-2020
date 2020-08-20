export const uintHash = (a: number) => {
  a -= a << 6
  a ^= a >>> 17
  a -= a << 9
  a ^= a << 4
  a -= a << 3
  a ^= a << 10
  a ^= a >>> 15
  a ^= a >> 16
  a *= 0x85ebca6b
  a ^= a >> 13
  return a >>> 0
}

/** Seedable pseudorandom 32 bit unsigned integer random generator. */
export const xoshiro128ss = (a: number, b: number, c: number, d: number) => {
  return () => {
    const t = b << 9
    let r = a * 5
    r = ((r << 7) | (r >>> 25)) * 9
    c ^= a
    d ^= b
    b ^= c
    a ^= d
    c ^= t
    d = (d << 11) | (d >>> 21)
    return r >>> 0
  }
}
