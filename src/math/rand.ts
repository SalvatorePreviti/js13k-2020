/** Seedable pseudorandom 32 bit unsigned integer random generator. */
export const xoshiro128ss = (a: number, b: number, c: number = a * b, d: number = a - b) => {
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
