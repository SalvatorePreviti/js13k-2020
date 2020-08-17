import { gl, loadShaderProgram, glDrawFullScreenTriangle } from './gl'

import { code as vertexShaderCode } from './shaders/vertex.vert'
import { code as heightmapShaderCode } from './shaders/heightmap.frag'
import { debug_time, debug_timeEnd } from './debug'

export const HEIGHTMAP_TETURE_SIZE = 1024

export const heightmapTexture: WebGLTexture = gl.createTexture()

export const buildHeightmapTexture = () => {
  debug_time(buildHeightmapTexture.name)

  gl.bindTexture(gl.TEXTURE_2D, heightmapTexture)
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    HEIGHTMAP_TETURE_SIZE,
    HEIGHTMAP_TETURE_SIZE,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    null
  )

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

  // Create and bind the framebuffer

  const fb = gl.createFramebuffer()
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb)
  gl.viewport(0, 0, HEIGHTMAP_TETURE_SIZE, HEIGHTMAP_TETURE_SIZE)

  // attach the texture as the first color attachment
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, heightmapTexture, 0)

  // Load the shader

  const shaderProgram = loadShaderProgram(vertexShaderCode, heightmapShaderCode, 'heightmap')
  gl.uniform2f(gl.getUniformLocation(shaderProgram, 'iResolution'), HEIGHTMAP_TETURE_SIZE, HEIGHTMAP_TETURE_SIZE)

  // Render

  gl.clearColor(0, 0, 1, 1)
  glDrawFullScreenTriangle()

  gl.finish()

  // Deallocate stuff
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, null, 0)
  gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  gl.deleteProgram(shaderProgram)
  gl.deleteFramebuffer(fb)

  debug_timeEnd(buildHeightmapTexture.name)
}
