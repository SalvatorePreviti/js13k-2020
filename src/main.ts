import './css/styles.less'
import { gl } from './gl'
import { canvasSize } from './canvas'

import { debug_updateInfo, debug_exec } from './debug/debug'

function debugAnimationFrame() {
  gl.viewport(0, 0, canvasSize.w, canvasSize.h)

  requestAnimationFrame(debugAnimationFrame)

  debug_updateInfo()
}

debug_exec(() => {
  console.log('HELLO WORLD THIS SHOULD NOT HAPPEN IN RELEASE MODE!!!!!')
})

requestAnimationFrame(debugAnimationFrame)
