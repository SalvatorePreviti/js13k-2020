import './css/styles.less'
import { gl, glDrawFullScreenTriangle } from './gl'
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
  shaderProgram
} from './shader-program'
import { cameraPos, updateCamera, cameraDir, cameraEuler, cameraMat3 } from './camera'

import { buildHeightmapTexture } from './texture-heightmap'

let frameIndex: number = 1
let prevTime = 0

buildHeightmapTexture()
loadMainShaderProgram()

const animationFrame = debug_trycatch_wrap(
  (timeMilliseconds: number) => {
    debug_beginTime()

    const time = timeMilliseconds / 1000
    const timeDelta = time - prevTime
    requestAnimationFrame(animationFrame)

    updateCamera(timeDelta)

    gl.viewport(0, 0, canvasSize.x, canvasSize.y)

    // Canvas resolution in pixels
    gl.uniform2f(shaderProgram_iResolution, canvasSize.x, canvasSize.y)

    // Time in seconds
    gl.uniform1f(shaderProgram_iTime, time)

    // Frame counter
    gl.uniform1i(shaderProgram_iFrame, frameIndex)

    // Camera position
    gl.uniform3f(shaderProgram_iCameraPos, cameraPos.x, cameraPos.y, cameraPos.z)

    // Camera direction
    gl.uniform3f(shaderProgram_iCameraDir, cameraDir.x, cameraDir.y, cameraDir.z)

    // Camera rotation, x is yaw and y is pitch
    gl.uniform2f(shaderProgram_iCameraEuler, cameraEuler.x, cameraEuler.y)

    // Camera rotation matrix
    gl.uniformMatrix3fv(shaderProgram_iCameraMat3, false, cameraMat3)

    glDrawFullScreenTriangle()

    frameIndex++
    prevTime = time

    debug_endTime(time)
  },
  { rethrow: false, file: import.meta.url }
)

requestAnimationFrame(animationFrame)

if (import.meta.hot) {
  const reloadMainShader = () => {
    debug_log('reloading main shader')
    loadMainShaderProgram()
  }

  const reloadHeightmap = () => {
    debug_log('reloading heightmap')
    buildHeightmapTexture(prevTime)
    gl.useProgram(shaderProgram) // Switch back to the main program
  }

  //setInterval(reloadHeightmap, 300)

  import.meta.hot.on('/src/shaders/vertex.vert', () => {
    reloadHeightmap()
    reloadMainShader()
  })

  import.meta.hot.on('/src/shaders/fragment.frag', reloadMainShader)
  import.meta.hot.on('/src/shaders/heightmap.frag', reloadHeightmap)
}
