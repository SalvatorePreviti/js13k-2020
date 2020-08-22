import './css/styles.less'
import { glDrawFullScreenTriangle } from './gl-utils'
import { canvasSize } from './canvas'
import { debug_beginTime, debug_endTime, debug_trycatch_wrap, debug_log } from './debug'

import { cameraPos, updateCamera, cameraDir, cameraEuler, cameraMat3 } from './camera'

import { buildHeightmapTexture } from './texture-heightmap'
import { buildNoiseTexture } from './texture-noise'
import { gl_uniform2f, gl_viewport, gl_uniform1f, gl_uniform1i, gl_uniform3f, gl_uniformMatrix3fv } from './gl_context'
import { updateAnimations, ANIMATIONS } from './animations'
import { GAME_OBJECTS, updateGameObjects } from './objects'
import { updateText } from './text'
import { loadMainShader, mainShader, MainShaderProgram } from './shader-program'

let prevTime = 0
let time = 0

buildNoiseTexture()
buildHeightmapTexture()
loadMainShader()

function setMainShaderUniforms(shader: MainShaderProgram) {
  shader._use()

  // Canvas resolution in pixels
  gl_uniform2f(shader._iResolution, canvasSize.x, canvasSize.y)

  // Time in seconds
  gl_uniform1f(shader._iTime, time)

  // Camera position
  gl_uniform3f(shader._iCameraPos, cameraPos.x, cameraPos.y, cameraPos.z)

  // Camera direction
  gl_uniform3f(shader._iCameraDir, cameraDir.x, cameraDir.y, cameraDir.z)

  // Camera rotation, x is yaw and y is pitch
  gl_uniform2f(shader._iCameraEuler, cameraEuler.x, cameraEuler.y)

  // Camera rotation matrix
  gl_uniformMatrix3fv(shader._iCameraMat3, false, cameraMat3)

  //Key visibility
  gl_uniform1i(shader._iGOKeyVisible, GAME_OBJECTS._key._visible ? 1 : 0)

  //prison door, open-closed
  gl_uniform1f(shader._iAnimPrisonDoor, ANIMATIONS._prisonDoor._value)
}

const animationFrame = debug_trycatch_wrap(
  (timeMilliseconds: number) => {
    debug_beginTime()

    time = timeMilliseconds / 1000
    const timeDelta = time - prevTime
    requestAnimationFrame(animationFrame)

    updateCamera(timeDelta)
    updateAnimations(timeDelta)
    updateGameObjects()
    updateText(timeDelta)

    gl_viewport(0, 0, canvasSize.x, canvasSize.y)
    setMainShaderUniforms(mainShader)
    glDrawFullScreenTriangle()

    prevTime = time

    debug_endTime(time)
  },
  { rethrow: false, file: import.meta.url }
)

requestAnimationFrame(animationFrame)

if (import.meta.hot) {
  const reloadMainShader = () => {
    debug_log('reloading main shader')
    loadMainShader()
  }

  const reloadHeightmap = () => {
    debug_log('reloading heightmap')
    buildHeightmapTexture(prevTime)
  }

  //setInterval(reloadHeightmap, 300)

  import.meta.hot.on('/src/shaders/vertex.vert', () => {
    reloadHeightmap()
    reloadMainShader()
  })

  import.meta.hot.on('/src/shaders/fragment.frag', reloadMainShader)
  import.meta.hot.on('/src/shaders/heightmap.frag', reloadHeightmap)
}
