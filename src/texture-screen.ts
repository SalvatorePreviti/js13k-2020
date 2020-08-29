import { debug_time, debug_timeEnd } from './debug'
import {
  gl_createTexture,
  gl_bindTexture,
  gl_texImage2D,
  gl_deleteFramebuffer,
  gl_deleteProgram,
  gl_bindFramebuffer,
  gl_framebufferTexture2D,
  gl_createFramebuffer,
  gl_activeTexture,
  gl_pixelStorei
} from './gl/gl-context'
import { loadMainShaderProgram } from './shader-program'
import { canvasElement } from './gl/canvas'
import { objectAssign } from './core/objects'
import { GL_TEXTURE2, GL_TEXTURE_2D, GL_RGBA, GL_UNSIGNED_BYTE, GL_UNPACK_ALIGNMENT } from './gl/gl-constants'

export const SCREEN_TEXTURE_SIZE = 1024

export const screenTexture: WebGLTexture = gl_createTexture()

export const buildScreenTexture = () => {
  debug_time(buildScreenTexture)

  const canvas = document.createElement('canvas')
  canvas.width = SCREEN_TEXTURE_SIZE
  canvas.height = SCREEN_TEXTURE_SIZE
  objectAssign(canvas.style, {
    width: `${SCREEN_TEXTURE_SIZE}px`,
    height: `${SCREEN_TEXTURE_SIZE}px`,
    //opacity: '.004',
    position: 'absolute'
  } as Partial<CSSStyleDeclaration>)
  canvas.prepend(document.body)
  //document.body.prepend(canvas)

  const context = canvas.getContext('2d')

  context.fillStyle = '#000'
  context.fillRect(0, 0, SCREEN_TEXTURE_SIZE, SCREEN_TEXTURE_SIZE)

  const imageData = context.getImageData(0, 0, SCREEN_TEXTURE_SIZE, SCREEN_TEXTURE_SIZE)

  gl_activeTexture(GL_TEXTURE2)
  gl_bindTexture(GL_TEXTURE_2D, screenTexture)
  gl_pixelStorei(GL_UNPACK_ALIGNMENT, 1)
  gl_texImage2D(
    GL_TEXTURE_2D,
    0,
    GL_RGBA,
    SCREEN_TEXTURE_SIZE,
    SCREEN_TEXTURE_SIZE,
    0,
    GL_RGBA,
    GL_UNSIGNED_BYTE,
    imageData
  )

  gl_activeTexture(GL_TEXTURE2)

  canvas.remove()

  debug_timeEnd(buildScreenTexture)
}
