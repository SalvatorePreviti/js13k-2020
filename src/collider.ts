import { glDrawFullScreenTriangle } from './gl/gl-utils'
import {
  GL_UNSIGNED_BYTE,
  GL_RGBA,
  GL_TEXTURE_2D,
  GL_FRAMEBUFFER,
  GL_COLOR_ATTACHMENT0,
  GL_TEXTURE2
} from './gl/gl-constants'
import {
  gl_createTexture,
  gl_bindTexture,
  gl_texImage2D,
  gl_bindFramebuffer,
  gl_framebufferTexture2D,
  gl_createFramebuffer,
  gl_readPixels,
  gl_activeTexture
} from './gl/gl-context'
import { collisionShader } from './shader-program'
import { debug_collisionBufferCanvasPrepare } from './debug'
import { PI, cos, sin, unpackFloatBytes3, abs } from './math/scalar'
import { cameraMoveDown, cameraPos } from './camera'

const COLLIDER_SIZE = 128

let GROUND_COLLISION = 0

const _colliderTexture: WebGLTexture = gl_createTexture()
const _colliderFrameBuffer = gl_createFramebuffer()

const colliderBuffer = new Uint8Array(COLLIDER_SIZE * COLLIDER_SIZE * 4)

debug_collisionBufferCanvasPrepare(colliderBuffer, COLLIDER_SIZE, COLLIDER_SIZE)

const readDist = (x: number, y: number): number => {
  const bufIdx = y * COLLIDER_SIZE * 4 + x * 4
  return unpackFloatBytes3(colliderBuffer[bufIdx + 1], colliderBuffer[bufIdx + 2], colliderBuffer[bufIdx + 3])
}

const getAngleFromIdx = (x: number): number => -((PI * (x - 64)) / 64) - PI / 2

export const updateCollider = (time: number, timeDelta: number) => {
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

  // Process data

  const rows = [0, 0]
  for (let rowY = 0; rowY < 2; rowY++) {
    for (let x = 0; x < 128; x++) {
      rows[rowY] += colliderBuffer[rowY * 128 * 4 + x * 4 + 0] > 127 ? 1 : 0
    }
  }
  if (rows[0] < 128) {
    GROUND_COLLISION = -1 //falling
  } else if (rows[1] < 128) {
    GROUND_COLLISION = 0 //perfect
  } else {
    GROUND_COLLISION = 1 //push player upwards
  }

  let ddx = 0
  let ddz = 0
  for (let y = 32; y < 96; ++y) {
    for (let x1 = 0; x1 < 64; ++x1) {
      const x2 = x1 + 64

      const dist1 = readDist(x1, y)
      const dist2 = readDist(x2, y)

      const angle1 = getAngleFromIdx(x1)
      const angle2 = getAngleFromIdx(x2)

      const dx = cos(angle1) * dist1 + cos(angle2) * dist2
      const dz = sin(angle1) * dist1 + sin(angle2) * dist2

      if (abs(dx) > abs(ddx)) {
        ddx = dx
      }
      if (abs(dz) > abs(ddz)) {
        ddz = dz
      }
    }
  }

  cameraPos.x += ddx
  cameraPos.z += ddz

  cameraPos.y += 1.5 * timeDelta * GROUND_COLLISION

  // Unbind the frame buffer

  gl_bindFramebuffer(GL_FRAMEBUFFER, null)
}
