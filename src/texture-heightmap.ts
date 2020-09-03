import { glDrawFullScreenTriangle, glSetTextureSampling } from './gl/gl-utils'

import { debug_time, debug_timeEnd } from './debug'
import {
  GL_UNSIGNED_BYTE,
  GL_RGBA,
  GL_TEXTURE_2D,
  GL_FRAMEBUFFER,
  GL_COLOR_ATTACHMENT0,
  GL_CLAMP_TO_EDGE,
  GL_TEXTURE1
} from './gl/gl-constants'
import {
  gl_createTexture,
  gl_bindTexture,
  gl_texImage2D,
  gl_deleteFramebuffer,
  gl_deleteProgram,
  gl_bindFramebuffer,
  gl_framebufferTexture2D,
  gl_createFramebuffer,
  gl_activeTexture
} from './gl/gl-context'
import { loadMainShaderProgram } from './shader-program'

export const HEIGHTMAP_TETURE_SIZE = 2048

export const heightmapTexture: WebGLTexture = gl_createTexture()

export const buildHeightmapTexture = () => {
  debug_time(buildHeightmapTexture)

  gl_activeTexture(GL_TEXTURE1)
  gl_bindTexture(GL_TEXTURE_2D, heightmapTexture)
  gl_texImage2D(
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

  // Create and bind the framebuffer

  const fb = gl_createFramebuffer()
  gl_bindFramebuffer(GL_FRAMEBUFFER, fb)

  // attach the texture as the first color attachment
  gl_framebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, GL_TEXTURE_2D, heightmapTexture, 0)

  // Load the shader

  const program = loadMainShaderProgram('h')

  program._use(0, HEIGHTMAP_TETURE_SIZE, HEIGHTMAP_TETURE_SIZE)

  // Render

  glDrawFullScreenTriangle()

  // Deallocate stuff
  gl_framebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, GL_TEXTURE_2D, null, 0)
  gl_bindFramebuffer(GL_FRAMEBUFFER, null)
  gl_deleteProgram(program._program)
  gl_deleteFramebuffer(fb)

  debug_timeEnd(buildHeightmapTexture)
}
