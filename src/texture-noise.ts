import { gl } from './gl'
import { debug_time, debug_timeEnd } from './debug'
import { wrapNatural } from './math/scalar'
import { xoshiro128ss } from './math/rand'

export const NOISE_TEXTURE_SIZE = 512

export const noiseTexture: WebGLTexture = gl.createTexture()

export const buildNoiseTexture = () => {
  debug_time(buildNoiseTexture)

  gl.activeTexture(gl.TEXTURE1)
  gl.bindTexture(gl.TEXTURE_2D, noiseTexture)

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

  gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, NOISE_TEXTURE_SIZE, NOISE_TEXTURE_SIZE, 0, gl.RGBA, gl.UNSIGNED_BYTE, data)

  gl.bindTexture(gl.TEXTURE_2D, noiseTexture)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

  gl.bindTexture(gl.TEXTURE_2D, noiseTexture)
  gl.activeTexture(gl.TEXTURE0)

  debug_timeEnd(buildNoiseTexture)
}
