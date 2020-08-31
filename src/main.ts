import './css/styles.css'
import { glDrawFullScreenTriangle } from './gl/gl-utils'
import { pageState, resumeGame } from './page'
import { debug_beginFrame, debug_endFrame, debug_trycatch_wrap, debug_log, debug_updateCameraPosition } from './debug'

import { updateCamera, cameraPos } from './camera'
import { buildHeightmapTexture } from './texture-heightmap'
import { buildNoiseTexture } from './texture-noise'
import { updateAnimations } from './state/animations'
import { updateGameObjects } from './state/objects'
import { updateText } from './text'
import { loadMainShader, mainShader } from './shader-program'
import { updateCollider } from './collider'
import { buildScreenTextures, bindScreenTexture } from './texture-screen'

let prevTime = 0
let time = 0

onload = () => {
  resumeGame() //showMainMenu()

  buildNoiseTexture()
  buildHeightmapTexture()
  buildScreenTextures()
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

      updateCamera(timeDelta)

      if (!pageState._mainMenu) {
        updateCollider(time)
      }

      debug_updateCameraPosition(cameraPos)

      updateAnimations(timeDelta)
      updateGameObjects()
      updateText(timeDelta)

      // Render main scene

      bindScreenTexture(time & 1)

      mainShader._use(time, pageState._w, pageState._h)

      glDrawFullScreenTriangle()

      prevTime = time

      debug_endFrame(time)
    },
    { rethrow: false, file: import.meta.url }
  )

  requestAnimationFrame(animationFrame)
}

if (import.meta.hot) {
  const reloadMainShader = () => {
    debug_log('reloading main shader')
    loadMainShader()
    buildHeightmapTexture()
  }

  import.meta.hot.on('/src/shaders/vertex.vert', reloadMainShader)
  import.meta.hot.on('/src/shaders/fragment.frag', reloadMainShader)
}
