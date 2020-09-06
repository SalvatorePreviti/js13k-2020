import { glSetTextureSampling, glDrawFullScreenTriangle, glFrameBuffer } from './gl/gl-utils'

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
import {
  gl_createTexture,
  gl_bindTexture,
  gl_texImage2D,
  gl_bindFramebuffer,
  gl_framebufferTexture2D,
  gl_activeTexture
} from './gl/gl-context'

export const PRERENDERED_TEXTURE_SIZE = 256

export const prerenderedTexture: WebGLTexture = gl_createTexture()

export const initPrerenderedTexture = () => {
  debug_time(initPrerenderedTexture)

  gl_activeTexture(GL_TEXTURE2)
  gl_bindTexture(GL_TEXTURE_2D, prerenderedTexture)
  gl_texImage2D(
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

  gl_bindFramebuffer(GL_FRAMEBUFFER, glFrameBuffer)

  // attach the texture as the first color attachment
  gl_framebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, GL_TEXTURE_2D, prerenderedTexture, 0)

  gl_bindFramebuffer(GL_FRAMEBUFFER, null)

  debug_timeEnd(initPrerenderedTexture)
}

export const renderToPrerenderedTexture = () => {
  gl_bindFramebuffer(GL_FRAMEBUFFER, glFrameBuffer)
  glDrawFullScreenTriangle()
  gl_bindFramebuffer(GL_FRAMEBUFFER, null)
}
