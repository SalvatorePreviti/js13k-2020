import { gl, loadShaderProgram, glDrawFullScreenTriangle, glSetTextureLinearSampling } from './gl'

import { code as vertexShaderCode } from './shaders/vertex.vert'
import { code as heightmapShaderCode } from './shaders/heightmap.frag'
import { debug_time, debug_timeEnd } from './debug'
import { GL_UNSIGNED_BYTE, GL_RGBA, GL_TEXTURE_2D, GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0 } from './core/gl-constants'

export const HEIGHTMAP_TETURE_SIZE = 2048

export const heightmapTexture: WebGLTexture = gl.createTexture()

export const buildHeightmapTexture = (seed: number = 0) => {
  debug_time(buildHeightmapTexture)

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

  glSetTextureLinearSampling()

  // Create and bind the framebuffer

  const fb = gl.createFramebuffer()
  gl.bindFramebuffer(GL_FRAMEBUFFER, fb)
  gl.viewport(0, 0, HEIGHTMAP_TETURE_SIZE, HEIGHTMAP_TETURE_SIZE)

  // attach the texture as the first color attachment
  gl.framebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, GL_TEXTURE_2D, heightmapTexture, 0)

  // Load the shader

  const shaderProgram = loadShaderProgram(vertexShaderCode, heightmapShaderCode, 'heightmap')
  gl.uniform2f(gl.getUniformLocation(shaderProgram, 'iResolution'), HEIGHTMAP_TETURE_SIZE, HEIGHTMAP_TETURE_SIZE)
  gl.uniform1f(gl.getUniformLocation(shaderProgram, 'iTime'), seed)

  // Render

  glDrawFullScreenTriangle()

  gl.finish()

  // Deallocate stuff
  gl.framebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, GL_TEXTURE_2D, null, 0)
  gl.bindFramebuffer(GL_FRAMEBUFFER, null)
  gl.deleteProgram(shaderProgram)
  gl.deleteFramebuffer(fb)

  gl.bindTexture(GL_TEXTURE_2D, heightmapTexture)

  debug_timeEnd(buildHeightmapTexture)
}
