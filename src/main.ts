import './css/styles.less'
import { glDrawFullScreenTriangle } from './gl/gl-utils'
import { canvasSize } from './gl/canvas'
import { debug_beginFrame, debug_endFrame, debug_trycatch_wrap, debug_log, debug_updateCameraPosition } from './debug'

import { updateCamera, cameraPos } from './camera'
import { buildHeightmapTexture } from './texture-heightmap'
import { buildNoiseTexture } from './texture-noise'
import { updateAnimations } from './animations'
import { updateGameObjects } from './objects'
import { updateText } from './text'
import { loadMainShader, mainShader } from './shader-program'
import { updateCollider } from './collider'
import { buildScreenTexture } from './texture-screen'

let prevTime = 0
let time = 0

buildScreenTexture()
buildNoiseTexture()
buildHeightmapTexture()
loadMainShader()

const animationFrame = debug_trycatch_wrap(
  (timeMilliseconds: number) => {
    debug_beginFrame()

    time = timeMilliseconds / 1000
    const timeDelta = time - prevTime
    requestAnimationFrame(animationFrame)

    updateCamera(timeDelta)
    //updateCollider(time, timeDelta)
    debug_updateCameraPosition(cameraPos)

    updateAnimations(timeDelta)
    updateGameObjects()
    updateText(timeDelta)

    // Render main scene

    mainShader._use(time, canvasSize.x, canvasSize.y)

    glDrawFullScreenTriangle()

    prevTime = time

    debug_endFrame(time)
  },
  { rethrow: false, file: import.meta.url }
)

requestAnimationFrame(animationFrame)

if (import.meta.hot) {
  const reloadMainShader = () => {
    debug_log('reloading main shader')
    loadMainShader()
    buildHeightmapTexture()
  }

  //setInterval(reloadHeightmap, 300)

  import.meta.hot.on('/src/shaders/vertex.vert', reloadMainShader)
  import.meta.hot.on('/src/shaders/fragment.frag', reloadMainShader)
}
