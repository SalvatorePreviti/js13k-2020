import { debug_time, debug_timeEnd } from './debug'
import { GL_TEXTURE_2D, GL_RGBA, GL_UNSIGNED_BYTE, GL_TEXTURE0 } from './gl/gl-constants'
import { gl_activeTexture, gl_bindTexture, gl_texImage2D, gl_createTexture } from './gl/gl-context'
import { glSetTextureSampling } from './gl/gl-utils'

const NOISE_TEXTURE_SIZE = 512

const noiseTexture: WebGLTexture = gl_createTexture()

export const buildNoiseTexture = () => {
  debug_time(buildNoiseTexture)

  gl_activeTexture(GL_TEXTURE0)
  gl_bindTexture(GL_TEXTURE_2D, noiseTexture)

  const data = new Uint8Array(NOISE_TEXTURE_SIZE * NOISE_TEXTURE_SIZE * 4)

  // Seeds for the xoshiro pseudorandom number generator xoshiro, http://prng.di.unimi.it/
  let xoshiroA = 345
  let xoshiroB = 737
  let xoshiroC = 1082
  let xoshiroD = 254265

  for (let y = 0; y < NOISE_TEXTURE_SIZE; ++y) {
    const ay = y * (NOISE_TEXTURE_SIZE * 4)
    const by = ((((y - 1) % NOISE_TEXTURE_SIZE) + NOISE_TEXTURE_SIZE) % NOISE_TEXTURE_SIZE) * (NOISE_TEXTURE_SIZE * 4)
    for (let x = 0; x < NOISE_TEXTURE_SIZE; ++x) {
      const t = xoshiroB << 9
      let xoshiro = xoshiroA * 5
      xoshiro = ((xoshiro << 7) | (xoshiro >>> 25)) * 9
      xoshiroC ^= xoshiroA
      xoshiroD ^= xoshiroB
      xoshiroB ^= xoshiroC
      xoshiroA ^= xoshiroD
      xoshiroC ^= t
      xoshiroD = (xoshiroD << 11) | (xoshiroD >>> 21)
      xoshiro &= 0xff

      // Weird alignment so GBA contains neighbours cells of R, to reduce texel access in fragment shader.

      const ax = x * 4
      const bx = ((((x - 1) % NOISE_TEXTURE_SIZE) + NOISE_TEXTURE_SIZE) % NOISE_TEXTURE_SIZE) * 4

      data[ax + ay] = xoshiro
      data[bx + ay + 1] = xoshiro
      data[ax + by + 2] = xoshiro
      data[bx + by + 3] = xoshiro
    }
  }

  gl_texImage2D(GL_TEXTURE_2D, 0, GL_RGBA, NOISE_TEXTURE_SIZE, NOISE_TEXTURE_SIZE, 0, GL_RGBA, GL_UNSIGNED_BYTE, data)

  glSetTextureSampling()

  debug_timeEnd(buildNoiseTexture)
}
