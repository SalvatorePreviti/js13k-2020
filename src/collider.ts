import { glDrawFullScreenTriangle } from './gl-utils'
import {
  GL_UNSIGNED_BYTE,
  GL_RGBA,
  GL_TEXTURE_2D,
  GL_FRAMEBUFFER,
  GL_COLOR_ATTACHMENT0,
  GL_TEXTURE2
} from './core/gl-constants'
import {
  gl_createTexture,
  gl_bindTexture,
  gl_texImage2D,
  gl_bindFramebuffer,
  gl_framebufferTexture2D,
  gl_createFramebuffer,
  gl_readPixels,
  gl_activeTexture
} from './gl_context'
import { collisionShader } from './shader-program'
import { debug_collisionBufferCanvasPrepare } from './debug'

export const COLLIDER_SIZE = 128

const _colliderTexture: WebGLTexture = gl_createTexture()
const _colliderFrameBuffer = gl_createFramebuffer()

const colliderBuffer = new Uint8Array(COLLIDER_SIZE * COLLIDER_SIZE * 4)

debug_collisionBufferCanvasPrepare(colliderBuffer, COLLIDER_SIZE, COLLIDER_SIZE)

export const updateCollider = (time: number) => {
  // Create and bind the framebuffer

  gl_bindFramebuffer(GL_FRAMEBUFFER, _colliderFrameBuffer)

  // Load the shader

  collisionShader._use(time, COLLIDER_SIZE, COLLIDER_SIZE)

  // Render

  gl_activeTexture(GL_TEXTURE2)
  gl_bindTexture(GL_TEXTURE_2D, _colliderTexture)
  gl_texImage2D(GL_TEXTURE_2D, 0, GL_RGBA, COLLIDER_SIZE, COLLIDER_SIZE, 0, GL_RGBA, GL_UNSIGNED_BYTE, null)
  gl_framebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, GL_TEXTURE_2D, _colliderTexture, 0)

  gl_bindTexture(GL_TEXTURE_2D, _colliderTexture)

  glDrawFullScreenTriangle()

  // Get the rendered data

  gl_readPixels(0, 0, COLLIDER_SIZE, COLLIDER_SIZE, GL_RGBA, GL_UNSIGNED_BYTE, colliderBuffer)

  // TODO: read colliderBuffer byte array somehow to do collision detection.
  // colliderBuffer is an RGBA byte buffer, RGBARGBARGBARGBA ...

  // Unbind the frame buffer

  gl_bindFramebuffer(GL_FRAMEBUFFER, null)
}
