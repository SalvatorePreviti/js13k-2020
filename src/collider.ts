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
import { PI } from './math/scalar'

export const COLLIDER_SIZE = 128

export const COLLISIONS = []

export let GROUND_COLLISION = 0

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

  let y = null
  //find the y with the most collision points
  //checks between rows 32 and 96, 8 rows at a time
  //that is: 50cm from ground - 150cm from ground, skipping 12.5cm at a time
  for (let yy = 32; yy < 96; yy += 8) {
    let maxSum = 0
    let sum = 0
    for (let x = 0; x < 128; x++) {
      sum += colliderBuffer[yy * 128 * 4 + x * 4 + 0] > 127 ? 1 : 0
    }
    //ignore lines that are fully red
    if (sum < 128 && sum > maxSum) {
      maxSum = sum
      y = yy
    }
  }

  COLLISIONS.length = 0
  if (y !== null) {
    let startCollision = null
    for (let x = 0; x < 128; x++) {
      if (colliderBuffer[y * 128 * 4 + x * 4 + 0] !== 0) {
        if (startCollision === null) {
          startCollision = x
        }
      } else if (startCollision !== null) {
        COLLISIONS.push({
          size: x - startCollision,
          angle: (PI * ((x + startCollision) / 2 - 64)) / 64
        })
        startCollision = null
      }
    }
    if (startCollision !== null) {
      COLLISIONS.push({
        size: 127 - startCollision,
        angle: (PI * ((127 + startCollision) / 2 - 64)) / 64
      })
    }
  }

  // TODO: read colliderBuffer byte array somehow to do collision detection.
  // colliderBuffer is an RGBA byte buffer, RGBARGBARGBARGBA ...

  // Unbind the frame buffer

  gl_bindFramebuffer(GL_FRAMEBUFFER, null)
}
