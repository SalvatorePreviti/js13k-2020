import { debug_time, debug_timeEnd } from './debug'
import { gl_createTexture, gl_bindTexture, gl_texImage2D, gl_pixelStorei, gl_activeTexture } from './gl/gl-context'
import { newProxyBinder } from './core/objects'
import {
  GL_TEXTURE3,
  GL_TEXTURE_2D,
  GL_RGBA,
  GL_UNSIGNED_BYTE,
  GL_UNPACK_ALIGNMENT,
  GL_CLAMP_TO_EDGE
} from './gl/gl-constants'
import { glSetTextureSampling } from './gl/gl-utils'
import { body, getElementById } from './page'

export const SCREEN_TEXTURE_SIZE = 512

const screenTextures: WebGLTexture[] = [gl_createTexture(), gl_createTexture(), gl_createTexture()]
let lastBoundTexture = -1

export const bindScreenTexture = (index: number) => {
  const texture = screenTextures[index]
  if (lastBoundTexture !== index) {
    lastBoundTexture = index
    gl_activeTexture(GL_TEXTURE3)
    gl_bindTexture(GL_TEXTURE_2D, texture)
  }
  return texture
}

export const buildScreenTextures = () => {
  debug_time(buildScreenTextures)

  const canvas = getElementById('D') as HTMLCanvasElement

  body.appendChild(canvas)

  const context = canvas.getContext('2d')
  const { strokeRect, fillText, fillRect, getImageData } = newProxyBinder(context)
  const setFontSize = (size: number) => {
    context.font = `${size}px monospace`
  }
  const setFillColor = (color: string) => {
    context.fillStyle = `#${color}`
  }

  const captureScreenTexture = (index: number) => {
    bindScreenTexture(index)
    const imageData = getImageData(0, 0, SCREEN_TEXTURE_SIZE, SCREEN_TEXTURE_SIZE)
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

    glSetTextureSampling(GL_CLAMP_TO_EDGE)
  }

  context.lineWidth = 5
  context.scale(1, 1.3)

  setFillColor('000015')
  fillRect(0, 0, SCREEN_TEXTURE_SIZE, SCREEN_TEXTURE_SIZE)

  setFontSize(17)

  setFillColor('aee')
  fillText('Memory Core: 131072K', 10, 100)
  fillText('Launching xx142-b2.exe', 10, 124)
  fillText('Antenna self test', 10, 146)
  fillText('Activating radio', 10, 170)

  setFillColor('8f8')
  fillText('OK', 245, 100)
  fillText('OK', 245, 124)
  fillText('OK', 245, 146)

  setFillColor('f66')
  fillText('FAIL', 245, 170)

  fillText('Insert floppy disk and press E to continue', 42, 280)

  setFontSize(20)
  fillText('💾 ERROR 404 - data disk not found', 48, 250)

  setFillColor('4f8aff')
  fillText('⬣ JS13K Modular Bios v.13', 10, 30)

  captureScreenTexture(0)

  context.strokeStyle = '#f00'
  strokeRect(20, 220, 472, 80)

  captureScreenTexture(1)

  context.strokeStyle = '#bb0'
  setFillColor('000')
  fillRect(20, 220, 472, 80)
  strokeRect(20, 220, 472, 80)
  setFillColor('bb0')
  fillText('Loading data disk...', 150, 265)

  captureScreenTexture(2)

  debug_timeEnd(buildScreenTextures)
}
