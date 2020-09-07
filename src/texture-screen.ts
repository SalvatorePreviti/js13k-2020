import { debug_time, debug_timeEnd } from './debug'
import { GL_TEXTURE3, GL_TEXTURE_2D, GL_RGBA, GL_UNSIGNED_BYTE, GL_CLAMP_TO_EDGE } from './gl/gl-constants'
import { glSetTextureSampling } from './gl/gl-utils'
//import { createElement } from './page'
import { sin, TWO_PI, clamp } from './math/scalar'
import { KeyFunctions, KEY_FORWARD, KEY_BACKWARD, KEY_STRAFE_LEFT, KEY_STRAFE_RIGHT } from './keyboard'
import { MINIGAME, MINIGAME_COMPLETE, MINIGAME_ACTIVE } from './state/minigame'
import { GAME_OBJECTS } from './state/objects'
import { runAnimation, ANIMATIONS } from './state/animations'
import { gl } from './page'

export const SCREEN_TEXTURE_SIZE = 512

const screenTextures: WebGLTexture[] = [gl.createTexture(), gl.createTexture(), gl.createTexture(), gl.createTexture()]
let lastBoundTexture = -1

export const bindScreenTexture = (index: number) => {
  const texture = screenTextures[index]
  if (lastBoundTexture !== index) {
    lastBoundTexture = index
    gl.activeTexture(GL_TEXTURE3)
    gl.bindTexture(GL_TEXTURE_2D, texture)
  }
  return texture
}

const canvas = document.createElement('canvas')
canvas.width = 512
canvas.height = 512
const context = canvas.getContext('2d')

const captureScreenTexture = (index: number) => {
  bindScreenTexture(index)
  const imageData = context.getImageData(0, 0, SCREEN_TEXTURE_SIZE, SCREEN_TEXTURE_SIZE)
  gl.texImage2D(
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

const drawFreq = (freq: number, phase: number) => {
  context.beginPath()
  for (let x = -5; x < SCREEN_TEXTURE_SIZE + 5; x++) {
    const y = (sin(x * 0.05) + sin((x * freq) / 3000 + (phase * TWO_PI) / 360)) * 25 + 100
    if (x < -4) {
      context.moveTo(x, y)
    } else {
      context.lineTo(x, y)
    }
  }
  context.stroke()
}

export const updateMinigameTexture = () => {
  context.fillStyle = '#000015'
  context.fillRect(0, 0, SCREEN_TEXTURE_SIZE, SCREEN_TEXTURE_SIZE)

  context.strokeStyle = '#f00'
  drawFreq(70, 300)
  context.globalCompositeOperation = 'lighter'
  context.strokeStyle = '#0ff'
  drawFreq(MINIGAME._frequency, MINIGAME._phase)
  context.globalCompositeOperation = 'source-over'
  context.fillStyle = '#ff0'
  context.fillText('Satellite Frequency Alignment', 10, 20)
  context.fillText('Frequency', 7, 260)
  context.fillText('Phase', 280, 380)
  context.strokeStyle = '#0a0'
  context.strokeRect(130, 170, 370, 180)
  context.beginPath()
  context.arc(135 + MINIGAME._phase, 175 + MINIGAME._frequency, 8, 0, TWO_PI)
  context.fill()

  if (MINIGAME._state === MINIGAME_COMPLETE) {
    context.fillStyle = '#000015'
    context.fillRect(0, 160, SCREEN_TEXTURE_SIZE, SCREEN_TEXTURE_SIZE)
    context.strokeRect(20, 180, 472, 120)
    context.fillStyle = '#ff0'
    context.fillText('🛰️ Satellite Frequency Found', 80, 230)
    context.fillText('Autonomous Submarine Activated', 75, 260)
  }

  captureScreenTexture(3)
}

const updateMinigameValues = (frequencyDelta: number, phaseDelta: number) => {
  if (MINIGAME._state === MINIGAME_ACTIVE) {
    MINIGAME._frequency = clamp(MINIGAME._frequency + frequencyDelta, 0, 170)
    MINIGAME._phase = clamp(MINIGAME._phase + phaseDelta, 0, 360)
    if (MINIGAME._frequency === 70 && MINIGAME._phase === 300) {
      MINIGAME._state = MINIGAME_COMPLETE
      GAME_OBJECTS._submarine._visible = true
      runAnimation(ANIMATIONS._submarine)
    }
    updateMinigameTexture()
  }
}

KeyFunctions[KEY_FORWARD] = () => updateMinigameValues(-5, 0)
KeyFunctions[KEY_BACKWARD] = () => updateMinigameValues(5, 0)
KeyFunctions[KEY_STRAFE_LEFT] = () => updateMinigameValues(0, -5)
KeyFunctions[KEY_STRAFE_RIGHT] = () => updateMinigameValues(0, 5)

export const buildScreenTextures = () => {
  debug_time(buildScreenTextures)

  context.lineWidth = 5
  context.scale(1, 1.3)

  context.fillStyle = '#000015'
  context.fillRect(0, 0, SCREEN_TEXTURE_SIZE, SCREEN_TEXTURE_SIZE)

  context.font = '17px monospace'

  context.fillStyle = '#aee'
  context.fillText('Memory Core: 132020K', 10, 100)
  context.fillText('Launching xx142-b2.exe', 10, 124)
  context.fillText('Antenna self test', 10, 146)
  context.fillText('Activating radio', 10, 170)

  context.fillStyle = '#8f8'
  context.fillText('OK', 245, 100)
  context.fillText('OK', 245, 124)
  context.fillText('OK', 245, 146)

  context.fillStyle = '#f66'
  context.fillText('FAIL', 245, 170)

  context.fillText('Insert floppy disk and press E to continue', 42, 280)

  context.font = '20px monospace'
  context.fillText('💾 ERROR 404 - data disk not found', 48, 250)

  context.fillStyle = '#4f8aff'
  context.fillText('⬣ JS13K Modular Bios v.13', 10, 30)

  captureScreenTexture(0)

  context.strokeStyle = '#f00'
  context.strokeRect(20, 220, 472, 80)

  captureScreenTexture(1)

  context.strokeStyle = '#bb0'
  context.fillStyle = '#000'
  context.fillRect(20, 220, 472, 80)
  context.strokeRect(20, 220, 472, 80)
  context.fillStyle = '#bb0'
  context.fillText('Loading data disk...', 150, 265)

  captureScreenTexture(2)

  updateMinigameTexture()

  debug_timeEnd(buildScreenTextures)
}
