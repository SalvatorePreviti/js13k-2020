import './css/styles.less'
import { gl } from './gl'
import { canvasSize } from './canvas'
import { debug_updateInfo, debug_trycatch_wrap } from './debug'
import {
  shaderProgram_iResolution,
  shaderProgram_iTime,
  shaderProgram_iFrame,
  shaderProgram_iCameraPos
} from './shader-program'
import { cameraPos, updateCamera } from './camera'

let frameIndex: number = 1
let prevTime = 0

const animationFrame = debug_trycatch_wrap(
  (timeMilliseconds: number) => {
    const time = timeMilliseconds / 1000
    const timeDelta = time - prevTime

    updateCamera(timeDelta)

    requestAnimationFrame(animationFrame)
    debug_updateInfo(time)

    gl.viewport(0, 0, canvasSize.w, canvasSize.h)

    // Canvas resolution in pixels
    gl.uniform2f(shaderProgram_iResolution, canvasSize.w, canvasSize.h)

    // Time in seconds
    gl.uniform1f(shaderProgram_iTime, time)

    // Frame counter
    gl.uniform1i(shaderProgram_iFrame, frameIndex)

    // Camera position
    gl.uniform3f(shaderProgram_iCameraPos, cameraPos.x, cameraPos.y, cameraPos.z)

    gl.drawArrays(gl.TRIANGLES, 0, 3)

    frameIndex++
    prevTime = time
  },
  { rethrow: false, file: import.meta.url }
)

requestAnimationFrame(animationFrame)
