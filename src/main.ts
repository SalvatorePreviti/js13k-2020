import './css/styles.css'
import { mainMenuVisible, renderHeight, renderWidth, gl, showMainMenu } from './page'
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
import { GL_TRIANGLES } from './gl/gl-constants'

let prevTime = 0
let time = 0

setTimeout(() => {
  buildNoiseTexture()
  buildHeightmapTexture()
  buildScreenTextures()
  initPrerenderedTexture()
  initCollider()
  loadMainShader()
  showMainMenu()

  const animationFrame = debug_trycatch_wrap(
    (timeMilliseconds: number) => {
      requestAnimationFrame(animationFrame)
      time = timeMilliseconds / 1000
      const timeDelta = min(time - prevTime, 0.33) //if we go below 30fps then game slows down

      debug_beginFrame()
      updateCamera(timeDelta, time)

      if (!mainMenuVisible && !GAME_OBJECTS._submarine._gameEnded) {
        updateCollider(time)
      }

      debug_updateCameraPosition(cameraPos)

      updateAnimations(timeDelta)
      updateGameObjects()
      updateText(timeDelta)

      // Prerender

      prerenderedShader(time, PRERENDERED_TEXTURE_SIZE, PRERENDERED_TEXTURE_SIZE)
      renderToPrerenderedTexture()

      // Render main scene

      bindScreenTexture(min(MINIGAME._state || time & 1, 3))

      mainShader(time, renderWidth, renderHeight)

      gl.drawArrays(GL_TRIANGLES, 0, 3)

      prevTime = time

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
