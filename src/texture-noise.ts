import { debug_time, debug_timeEnd } from './debug'
import { wrapNatural } from './math/scalar'
import { xoshiro128ss } from './math/rand'
import {
  GL_TEXTURE1,
  GL_TEXTURE_2D,
  GL_TEXTURE_WRAP_S,
  GL_TEXTURE_MAG_FILTER,
  GL_LINEAR,
  GL_TEXTURE_MIN_FILTER,
  GL_REPEAT,
  GL_TEXTURE_WRAP_T,
  GL_UNPACK_ALIGNMENT,
  GL_RGBA,
  GL_UNSIGNED_BYTE,
  GL_TEXTURE0
} from './gl/gl-constants'
import {
  gl_activeTexture,
  gl_bindTexture,
  gl_texParameteri,
  gl_texImage2D,
  gl_pixelStorei,
  gl_createTexture
} from './gl/gl-context'

export const NOISE_TEXTURE_SIZE = 512

export const noiseTexture: WebGLTexture = gl_createTexture()

export const buildNoiseTexture = () => {
  debug_time(buildNoiseTexture)

  gl_activeTexture(GL_TEXTURE1)
  gl_bindTexture(GL_TEXTURE_2D, noiseTexture)

  const nextRandom = xoshiro128ss(0x486666, 0xbadbeef, 0xc0ffee, 0xc05fefe)

  const len = NOISE_TEXTURE_SIZE * NOISE_TEXTURE_SIZE * 4
  const data = new Uint8Array(len)

  // Compute random data in R and G
  for (let y = 0, i = 0; y < NOISE_TEXTURE_SIZE; ++y) {
    for (let x = 0; x < NOISE_TEXTURE_SIZE; ++x) {
      data[i] = nextRandom() & 0xff
      i += 4
    }
  }

  const getValue = (x: number, z: number) => {
    return data[(wrapNatural(x, NOISE_TEXTURE_SIZE) + wrapNatural(z, NOISE_TEXTURE_SIZE) * NOISE_TEXTURE_SIZE) * 4]
  }

  for (let y = 0, i = 0; y < NOISE_TEXTURE_SIZE; ++y) {
    for (let x = 0; x < NOISE_TEXTURE_SIZE; ++x) {
      data[i + 1] = getValue(x + 1, y)
      data[i + 2] = getValue(x, y + 1)
      data[i + 3] = getValue(x + 1, y + 1)
      i += 4
    }
  }

  gl_pixelStorei(GL_UNPACK_ALIGNMENT, 1)
  gl_texImage2D(GL_TEXTURE_2D, 0, GL_RGBA, NOISE_TEXTURE_SIZE, NOISE_TEXTURE_SIZE, 0, GL_RGBA, GL_UNSIGNED_BYTE, data)

  gl_bindTexture(GL_TEXTURE_2D, noiseTexture)
  gl_texParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT)
  gl_texParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT)
  gl_texParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR)
  gl_texParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR)

  gl_bindTexture(GL_TEXTURE_2D, noiseTexture)
  gl_activeTexture(GL_TEXTURE0)

  debug_timeEnd(buildNoiseTexture)
}
