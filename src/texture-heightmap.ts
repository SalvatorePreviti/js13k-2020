import { loadShaderProgram, glDrawFullScreenTriangle, glSetTextureLinearSampling } from './gl-utils'

import { code as vertexShaderCode } from './shaders/vertex.vert'
import { code as heightmapShaderCode } from './shaders/heightmap.frag'
import { debug_time, debug_timeEnd } from './debug'
import { GL_UNSIGNED_BYTE, GL_RGBA, GL_TEXTURE_2D, GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0 } from './core/gl-constants'
import {
  gl_createTexture,
  gl_bindTexture,
  gl_texImage2D,
  gl_deleteFramebuffer,
  gl_deleteProgram,
  gl_bindFramebuffer,
  gl_framebufferTexture2D,
  gl_finish,
  gl_uniform1f,
  gl_uniform2f,
  gl_getUniformLocation,
  gl_viewport,
  gl_createFramebuffer
} from './gl_context'

export const HEIGHTMAP_TETURE_SIZE = 2048

export const heightmapTexture: WebGLTexture = gl_createTexture()

export const buildHeightmapTexture = (seed: number = 0) => {
  debug_time(buildHeightmapTexture)

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

  glSetTextureLinearSampling()

  // Create and bind the framebuffer

  const fb = gl_createFramebuffer()
  gl_bindFramebuffer(GL_FRAMEBUFFER, fb)
  gl_viewport(0, 0, HEIGHTMAP_TETURE_SIZE, HEIGHTMAP_TETURE_SIZE)

  // attach the texture as the first color attachment
  gl_framebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, GL_TEXTURE_2D, heightmapTexture, 0)

  // Load the shader

  const shaderProgram = loadShaderProgram(vertexShaderCode, heightmapShaderCode, 'heightmap')
  gl_uniform2f(gl_getUniformLocation(shaderProgram, 'iResolution'), HEIGHTMAP_TETURE_SIZE, HEIGHTMAP_TETURE_SIZE)
  gl_uniform1f(gl_getUniformLocation(shaderProgram, 'iTime'), seed)

  // Render

  glDrawFullScreenTriangle()

  gl_finish()

  // Deallocate stuff
  gl_framebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, GL_TEXTURE_2D, null, 0)
  gl_bindFramebuffer(GL_FRAMEBUFFER, null)
  gl_deleteProgram(shaderProgram)
  gl_deleteFramebuffer(fb)

  gl_bindTexture(GL_TEXTURE_2D, heightmapTexture)

  debug_timeEnd(buildHeightmapTexture)
}
