import './css/styles.less'
import { gl } from './gl'
import { canvasSize } from './canvas'
import { debug_updateInfo, debug_trycatch_wrap } from './debug'
import { shaderProgram_iResolution } from './shader-program'

const animationFrame = debug_trycatch_wrap(
  () => {
    requestAnimationFrame(animationFrame)
    debug_updateInfo()

    gl.viewport(0, 0, canvasSize.w, canvasSize.h)

    gl.uniform2f(shaderProgram_iResolution, canvasSize.w, canvasSize.h)

    gl.drawArrays(gl.TRIANGLES, 0, 3)
  },
  { rethrow: false, file: import.meta.url }
)

requestAnimationFrame(animationFrame)
