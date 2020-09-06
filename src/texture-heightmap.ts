import { glSetTextureSampling, glFrameBuffer } from './gl/gl-utils'

import { debug_time, debug_timeEnd } from './debug'
import {
  GL_UNSIGNED_BYTE,
  GL_RGBA,
  GL_TEXTURE_2D,
  GL_FRAMEBUFFER,
  GL_COLOR_ATTACHMENT0,
  GL_CLAMP_TO_EDGE,
  GL_TEXTURE1,
  GL_TRIANGLES
} from './gl/gl-constants'
import { loadMainShaderProgram } from './shader-program'
import { gl } from './page'

export const HEIGHTMAP_TETURE_SIZE = 2048

export const heightmapTexture: WebGLTexture = gl.createTexture()

export const buildHeightmapTexture = () => {
  debug_time(buildHeightmapTexture)

  gl.activeTexture(GL_TEXTURE1)
  gl.bindTexture(GL_TEXTURE_2D, heightmapTexture)
  gl.texImage2D(
    GL_TEXTURE_2D,
    0,
    GL_RGBA,
    HEIGHTMAP_TETURE_SIZE,
    HEIGHTMAP_TETURE_SIZE,
    0,
    GL_RGBA,
    GL_UNSIGNED_BYTE,
    null
  )

  glSetTextureSampling(GL_CLAMP_TO_EDGE)

  gl.bindFramebuffer(GL_FRAMEBUFFER, glFrameBuffer)
  gl.framebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, GL_TEXTURE_2D, heightmapTexture, 0)

  loadMainShaderProgram('h')(0, HEIGHTMAP_TETURE_SIZE, HEIGHTMAP_TETURE_SIZE)

  gl.drawArrays(GL_TRIANGLES, 0, 3)

  gl.bindFramebuffer(GL_FRAMEBUFFER, null)

  debug_timeEnd(buildHeightmapTexture)
}
