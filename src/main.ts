import './css/styles.css'
import { glDrawFullScreenTriangle } from './gl/gl-utils'
import { resumeGame, mainMenuVisible, renderHeight, renderWidth } from './page'
import { debug_beginFrame, debug_endFrame, debug_trycatch_wrap, debug_log, debug_updateCameraPosition } from './debug'

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
import { MINIGAME_LOADING, MINIGAME, MINIGAME_ACTIVE } from './state/minigame'
import './save-load'

let prevTime = 0
let time = 0

setTimeout(() => {
  resumeGame() //showMainMenu()

  buildNoiseTexture()
  buildHeightmapTexture()
  buildScreenTextures()
  initPrerenderedTexture()
  initCollider()
  loadMainShader()

  const animationFrame = debug_trycatch_wrap(
    (timeMilliseconds: number) => {
      requestAnimationFrame(animationFrame)
      time = timeMilliseconds / 1000
      const timeDelta = time - prevTime
      if (timeDelta < 0.07) {
        //return
      }

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

      prerenderedShader._use(time, PRERENDERED_TEXTURE_SIZE, PRERENDERED_TEXTURE_SIZE)
      renderToPrerenderedTexture()

      // Render main scene

      bindScreenTexture(MINIGAME._state >= MINIGAME_ACTIVE ? 3 : MINIGAME._state === MINIGAME_LOADING ? 2 : time & 1)

      mainShader._use(time, renderWidth, renderHeight)

      glDrawFullScreenTriangle()

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
  }

  import.meta.hot.on('/src/shaders/vertex.vert', reloadMainShader)
  import.meta.hot.on('/src/shaders/fragment.frag', reloadMainShader)
}
