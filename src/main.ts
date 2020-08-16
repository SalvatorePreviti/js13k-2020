import './css/styles.less'
import { gl } from './gl'
import { canvasSize } from './canvas'
import { debug_updateInfo, debug_trycatch_wrap } from './debug'
import { shaderProgram_iResolution, shaderProgram_iTime, shaderProgram_iFrame } from './shader-program'

let frameIndex: number = 1

const animationFrame = debug_trycatch_wrap(
  (timeMilliseconds: number) => {
    const timeSeconds = timeMilliseconds / 1000

    requestAnimationFrame(animationFrame)
    debug_updateInfo(timeSeconds)

    gl.viewport(0, 0, canvasSize.w, canvasSize.h)

    gl.uniform2f(shaderProgram_iResolution, canvasSize.w, canvasSize.h)

    // Time in seconds
    gl.uniform1f(shaderProgram_iTime, timeSeconds)

    // Frame counter
    gl.uniform1i(shaderProgram_iFrame, frameIndex)

    gl.drawArrays(gl.TRIANGLES, 0, 3)

    frameIndex++
  },
  { rethrow: false, file: import.meta.url }
)

requestAnimationFrame(animationFrame)
