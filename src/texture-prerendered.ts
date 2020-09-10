import { glSetTextureSampling } from './gl/gl-utils'

import { debug_time, debug_timeEnd } from './debug'
import {
  GL_UNSIGNED_BYTE,
  GL_RGBA,
  GL_TEXTURE_2D,
  GL_FRAMEBUFFER,
  GL_COLOR_ATTACHMENT0,
  GL_CLAMP_TO_EDGE,
  GL_TEXTURE2,
  GL_NEAREST
} from './gl/gl-constants'
import { gl, glFrameBuffer } from './page'

export const PRERENDERED_TEXTURE_SIZE = 256

export const prerenderedTexture: WebGLTexture = gl.createTexture()

export const initPrerenderedTexture = () => {
  debug_time(initPrerenderedTexture)

  gl.activeTexture(GL_TEXTURE2)
  gl.bindTexture(GL_TEXTURE_2D, prerenderedTexture)
  gl.texImage2D(
    GL_TEXTURE_2D,
    0,
    GL_RGBA,
    PRERENDERED_TEXTURE_SIZE,
    PRERENDERED_TEXTURE_SIZE,
    0,
    GL_RGBA,
    GL_UNSIGNED_BYTE,
    null
  )

  glSetTextureSampling(GL_CLAMP_TO_EDGE, GL_NEAREST)

  gl.bindFramebuffer(GL_FRAMEBUFFER, glFrameBuffer)

  // attach the texture as the first color attachment
  gl.framebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, GL_TEXTURE_2D, prerenderedTexture, 0)

  gl.bindFramebuffer(GL_FRAMEBUFFER, null)

  debug_timeEnd(initPrerenderedTexture)
}
