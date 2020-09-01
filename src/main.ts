import './css/styles.css'
import { glDrawFullScreenTriangle } from './gl/gl-utils'
import { pageState, showMainMenu } from './page'
import { debug_beginFrame, debug_endFrame, debug_trycatch_wrap, debug_log, debug_updateCameraPosition } from './debug'

import { updateCamera, cameraPos } from './camera'
import { buildHeightmapTexture } from './texture-heightmap'
import { buildNoiseTexture } from './texture-noise'
import { updateAnimations } from './state/animations'
import { updateGameObjects, GAME_OBJECTS } from './state/objects'
import { updateText } from './state/text'
import { loadMainShader, mainShader } from './shader-program'
import { updateCollider } from './collider'
import { loadingScreens, bindScreenTexture, minigameUpdate } from './context2D'
import { minigameState } from './state/minigame'
import { gl_clear } from './gl/gl'
import { GL_COLOR_BUFFER_BIT } from './gl/gl-constants'

let prevTime = 0
let time = 0

setTimeout(() => {
  loadingScreens()
  buildNoiseTexture()
  buildHeightmapTexture()
  loadMainShader()

  showMainMenu()

  minigameUpdate()

  const animationFrame = debug_trycatch_wrap(
    (timeMilliseconds: number) => {
      requestAnimationFrame(animationFrame)
      time = timeMilliseconds / 1000
      const timeDelta = time - prevTime
      debug_beginFrame()

      if (timeDelta < 0.1 && pageState._mainMenu) {
        debug_endFrame(time)
        return // Slow frame rate during menu
      }

      if (!pageState._mainMenu) {
        if (minigameState._active) {
          // Just clear the screen if the minigame is active
          gl_clear(GL_COLOR_BUFFER_BIT)
          debug_endFrame(time)
          return
        }

        updateCamera(timeDelta)
        updateCollider(time)
      }

      debug_updateCameraPosition(cameraPos)

      updateAnimations(timeDelta)
      updateGameObjects()
      updateText(timeDelta)

      // Render main scene

      bindScreenTexture(GAME_OBJECTS._antennaConsole._floppyInserted ? 2 : time & 1)

      mainShader._use(time, pageState._w, pageState._h)

      glDrawFullScreenTriangle()

      prevTime = time

      debug_endFrame(time)
    },
    { rethrow: false, file: import.meta.url }
  )

  requestAnimationFrame(animationFrame)
}, 250)

if (import.meta.hot) {
  const reloadMainShader = () => {
    debug_log('reloading main shader')
    loadMainShader()
    buildHeightmapTexture()
  }

  import.meta.hot.on('/src/shaders/vertex.vert', reloadMainShader)
  import.meta.hot.on('/src/shaders/fragment.frag', reloadMainShader)
}
