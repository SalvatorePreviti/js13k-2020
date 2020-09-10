import './css/styles.css'
import { mainMenuVisible, renderHeight, renderWidth, gl, showMainMenu, glFrameBuffer } from './page'
import { debug_beginFrame, debug_endFrame, debug_trycatch_wrap, debug_log, debug_updateCameraPosition } from './debug'

import { min } from './math/scalar'
import { updateCamera, cameraPos } from './camera'
import { buildHeightmapTexture } from './texture-heightmap'
import { buildNoiseTexture } from './texture-noise'
import { updateAnimations } from './state/animations'
import { updateGameObjects, GAME_OBJECTS } from './state/objects'
import { updateText } from './text'
import { loadMainShader, mainShader, prerenderedShader } from './shader-program'
import { updateCollider, initCollider } from './collider'
import { buildScreenTextures, bindScreenTexture } from './texture-screen'
import { initPrerenderedTexture, renderToPrerenderedTexture, PRERENDERED_TEXTURE_SIZE } from './texture-prerendered'
import { MINIGAME } from './state/minigame'
import './save-load'
import { loadMusic } from './music'
import { GL_TRIANGLES, GL_FRAMEBUFFER } from './gl/gl-constants'
import { updateTime, time } from './time'

setTimeout(() => {
  buildNoiseTexture()
  buildHeightmapTexture()
  buildScreenTextures()
  initPrerenderedTexture()
  initCollider()
  loadMainShader()
  loadMusic()
  showMainMenu()

  const animationFrame = debug_trycatch_wrap(
    (browserTimeInMilliseconds: number) => {
      requestAnimationFrame(animationFrame)

      debug_beginFrame()

      if (!updateTime(browserTimeInMilliseconds, mainMenuVisible)) {
        debug_endFrame(time)
        return
      }

      updateCamera()

      if (!mainMenuVisible) {
        if (!GAME_OBJECTS._submarine._gameEnded) {
          updateCollider(time)
        }
        updateAnimations()
        updateGameObjects()
        updateText()
      }

      debug_updateCameraPosition(cameraPos)

      // Prerender

      prerenderedShader(PRERENDERED_TEXTURE_SIZE, PRERENDERED_TEXTURE_SIZE)

      gl.bindFramebuffer(GL_FRAMEBUFFER, glFrameBuffer)
      gl.drawArrays(GL_TRIANGLES, 0, 3)
      gl.bindFramebuffer(GL_FRAMEBUFFER, null)

      // Render main scene

      bindScreenTexture(min(MINIGAME._state || time & 1, 3))

      mainShader(renderWidth, renderHeight)

      gl.drawArrays(GL_TRIANGLES, 0, 3)

      debug_endFrame(time)
    },
    { rethrow: false, file: import.meta.url }
  )

  requestAnimationFrame(animationFrame)
}, 99)

if (import.meta.hot) {
  const reloadMainShader = () => {
    debug_log('reloading main shader')
    loadMainShader()
    buildHeightmapTexture()
    initPrerenderedTexture()
  }

  import.meta.hot.on('/src/shaders/vertex.vert', reloadMainShader)
  import.meta.hot.on('/src/shaders/fragment.frag', reloadMainShader)
}
