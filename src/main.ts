import './css/styles.less'
import { gl } from './gl'
import { canvasSize } from './canvas'
import { debug_updateInfo } from './debug/debug'
import { shaderProgram_iResolution } from './shader-program'

function animationFrame() {
  requestAnimationFrame(animationFrame)
  debug_updateInfo()

  gl.viewport(0, 0, canvasSize.w, canvasSize.h)

  gl.uniform2f(shaderProgram_iResolution, canvasSize.w, canvasSize.h)

  gl.drawArrays(gl.TRIANGLES, 0, 3)
}

requestAnimationFrame(animationFrame)
