import { debug_time, debug_timeEnd } from './debug'
import { gl_createTexture, gl_bindTexture, gl_texImage2D, gl_pixelStorei, gl_activeTexture } from './gl/gl'
import { newProxyBinder } from './core/objects'
import {
  GL_TEXTURE3,
  GL_TEXTURE_2D,
  GL_RGBA,
  GL_UNSIGNED_BYTE,
  GL_UNPACK_ALIGNMENT,
  GL_CLAMP_TO_EDGE
} from './gl/gl-constants'
import { glSetTextureLinearSampling } from './gl/gl-utils'
import { context2D, bodyClassListSet } from './page'
import { minigameState } from './state/minigame'
import { wrapNatural, randomNatural } from './math/scalar'

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

const { strokeRect, fillText, fillRect, getImageData } = newProxyBinder(context2D)
const setFontSize = (size: number) => {
  context2D.font = `${size}px monospace`
}
const setFillColor = (color: string = '000015') => {
  context2D.fillStyle = `#${color}`
}

const setStrokeStyle = (style: string) => (context2D.strokeStyle = style)

export const loadingScreens = () => {
  debug_time(loadingScreens)

  const captureScreenTexture = (index: number, capture: boolean) => {
    if (capture) {
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

      glSetTextureLinearSampling(GL_CLAMP_TO_EDGE)
    }
  }

  const renderScreens = (capture: boolean) => {
    context2D.setTransform(1, 0, 0, 1, 0, 0)
    context2D.lineWidth = 5
    setFillColor()
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

    captureScreenTexture(0, capture)

    setStrokeStyle('#f00')
    strokeRect(20, 220, 472, 80)

    captureScreenTexture(1, capture)

    setStrokeStyle('#bb0')
    setFillColor()
    fillRect(20, 220, 472, 80)
    strokeRect(20, 220, 472, 80)
    setFillColor('bb0')
    fillText('💾 Loading data disk...', 130, 265)

    captureScreenTexture(2, capture)
  }

  renderScreens(true)
  renderScreens(false)

  debug_timeEnd(loadingScreens)
}

const minigameEmojiMap = ['', '⛵', '🏝️', '🐋']

export const minigameRedraw = () => {
  context2D.textAlign = 'center'
  context2D.textBaseline = 'middle'
  setFontSize(39)
  setFillColor()
  fillRect(0, 0, 512, 512)
  setFillColor('006994')
  for (let i = 0; i < 100; ++i) {
    const x = i % 10
    const y = (i / 10) | 0
    const sx = x * 51 + 4
    const sy = y * 47 + 20
    fillRect(sx, sy, 50, 46)
    fillText(minigameEmojiMap[minigameState._matrix[i] || 0], sx + 25, sy + 26, 47)
  }
  setFontSize(24)
  setFillColor('8ef')
  context2D.textAlign = 'right'
  fillText(`${minigameState._moves} Moves`, 512, 10)
  context2D.textAlign = 'left'
  fillText(`Islands ${minigameState._collectedIslands}`, 4, 10)
  fillText('Part 1: Collect as many islands as you can!', 4, 502, 512)
}

export const minigameNewLevel = () => {
  const matrix = minigameState._matrix
  matrix.fill(0)
  for (let i = 0; i < 9; ++i) {
    if (i & 1) {
      matrix[randomNatural(10) + i * 10] = 3
    }
    matrix[randomNatural(100)] = 2
  }
  if (!minigameState._level++) {
    // First level, place things in a predefined way :)
    for (let y = 0; y < 5; ++y) {
      for (let x = 0; x < 5; ++x) {
        matrix[y * 10 + x + 40] = 0
      }
    }
    matrix[33] = 2
    matrix[44] = 2
  }
  matrix[minigameState._boatIdx] = 1
}

const minigameCellIsIsland = (x: number) => x === 2

export const minigameUpdate = () => {
  // If there are no islands, reload the level
  if (!minigameState._matrix.some(minigameCellIsIsland)) {
    minigameNewLevel()
  }
  minigameRedraw()

  if (minigameState._level === 1 && minigameState._collectedIslands > 1) {
    // Begin the real game!
    minigameState._active = false
  }

  bodyClassListSet('P', !minigameState._active)
}

export const minigameMoveBoat = (x: number, y: number) => {
  if (minigameState._active) {
    const initialBoatIdx = minigameState._boatIdx
    const nx = wrapNatural((initialBoatIdx % 10) + x, 10)
    const ny = wrapNatural(((initialBoatIdx / 10) | 0) + y, 10)
    const nextBoatIdx = ny * 10 + nx
    const matrix = minigameState._matrix
    const oldValueAtNextIdx = matrix[nextBoatIdx]
    if (oldValueAtNextIdx !== 3) {
      ++minigameState._moves
      if (oldValueAtNextIdx === 2) {
        ++minigameState._collectedIslands
      }
      matrix[initialBoatIdx] = 0
      matrix[nextBoatIdx] = 1
      minigameState._boatIdx = nextBoatIdx
      minigameUpdate()
    }
  }
}
