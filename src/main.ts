import './css/styles.less'
import { glDrawFullScreenTriangle } from './gl-utils'
import { canvasSize } from './canvas'
import { debug_beginTime, debug_endTime, debug_trycatch_wrap, debug_log } from './debug'
import {
  shaderProgram_iResolution,
  shaderProgram_iTime,
  shaderProgram_iFrame,
  shaderProgram_iCameraPos,
  shaderProgram_iCameraDir,
  shaderProgram_iCameraEuler,
  shaderProgram_iCameraMat3,
  loadMainShaderProgram,
  shaderProgram,
  shaderProgram_iHeightmap,
  shaderProgram_iNoise,
  shaderProgram_iGOKeyVisible,
  shaderProgram_iAnimPrisonDoor
} from './shader-program'
import { cameraPos, updateCamera, cameraDir, cameraEuler, cameraMat3 } from './camera'

import { buildHeightmapTexture } from './texture-heightmap'
import { buildNoiseTexture } from './texture-noise'
import {
  gl_uniform2f,
  gl_viewport,
  gl_uniform1f,
  gl_uniform1i,
  gl_uniform3f,
  gl_uniformMatrix3fv,
  gl_useProgram
} from './gl_context'
import { updateAnimations, ANIMATIONS } from './animations'
import { GAME_OBJECTS, updateGameObjects } from './objects'
import { updateText } from './text'
import { play } from './music'

let frameIndex: number = 1
let prevTime = 0

buildNoiseTexture()
buildHeightmapTexture()
loadMainShaderProgram()

const animationFrame = debug_trycatch_wrap(
  (timeMilliseconds: number) => {
    debug_beginTime()

    const time = timeMilliseconds / 1000
    const timeDelta = time - prevTime
    requestAnimationFrame(animationFrame)

    updateCamera(timeDelta)
    updateAnimations(timeDelta)
    updateGameObjects()
    updateText(timeDelta)

    gl_viewport(0, 0, canvasSize.x, canvasSize.y)

    // Canvas resolution in pixels
    gl_uniform2f(shaderProgram_iResolution, canvasSize.x, canvasSize.y)

    // Time in seconds
    gl_uniform1f(shaderProgram_iTime, time)

    // Frame counter
    gl_uniform1i(shaderProgram_iFrame, frameIndex)

    // Camera position
    gl_uniform3f(shaderProgram_iCameraPos, cameraPos.x, cameraPos.y, cameraPos.z)

    // Camera direction
    gl_uniform3f(shaderProgram_iCameraDir, cameraDir.x, cameraDir.y, cameraDir.z)

    // Camera rotation, x is yaw and y is pitch
    gl_uniform2f(shaderProgram_iCameraEuler, cameraEuler.x, cameraEuler.y)

    // Camera rotation matrix
    gl_uniformMatrix3fv(shaderProgram_iCameraMat3, false, cameraMat3)

    gl_uniform1i(shaderProgram_iHeightmap, 0)
    gl_uniform1i(shaderProgram_iNoise, 1)

    //Key visibility
    gl_uniform1i(shaderProgram_iGOKeyVisible, GAME_OBJECTS._key._visible ? 1 : 0)

    //prison door, open-closed
    gl_uniform1f(shaderProgram_iAnimPrisonDoor, ANIMATIONS._prisonDoor._value)

    glDrawFullScreenTriangle()

    frameIndex++
    prevTime = time

    debug_endTime(time)
  },
  { rethrow: false, file: import.meta.url }
)

requestAnimationFrame(animationFrame)

//Music wont play until the user has interacted with document:
document.onclick = () => play()

if (import.meta.hot) {
  const reloadMainShader = () => {
    debug_log('reloading main shader')
    loadMainShaderProgram()
  }

  const reloadHeightmap = () => {
    debug_log('reloading heightmap')
    buildHeightmapTexture(prevTime)
    gl_useProgram(shaderProgram) // Switch back to the main program
  }

  //setInterval(reloadHeightmap, 300)

  import.meta.hot.on('/src/shaders/vertex.vert', () => {
    reloadHeightmap()
    reloadMainShader()
  })

  import.meta.hot.on('/src/shaders/fragment.frag', reloadMainShader)
  import.meta.hot.on('/src/shaders/heightmap.frag', reloadHeightmap)
}
