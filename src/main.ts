import './css/styles.less'
import { gl } from './gl'
import { canvasSize } from './canvas'
import { debug_updateInfo, debug_trycatch_wrap } from './debug'
import {
  shaderProgram_iResolution,
  shaderProgram_iTime,
  shaderProgram_iFrame,
  shaderProgram_iCameraPos,
  shaderProgram_iCameraDir
} from './shader-program'
import { cameraPos, updateCamera, cameraDir } from './camera'

import heightmapUrl from './heightmap.jpg'

let frameIndex: number = 1
let prevTime = 0

function loadHeightmapTexture() {
  const texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)

  const level = 0
  const internalFormat = gl.RGBA
  const width = 1
  const height = 1
  const border = 0
  const srcFormat = gl.RGBA
  const srcType = gl.UNSIGNED_BYTE

  // Create a dummy empty image because it may take time to load the image.
  const pixel = new Uint8Array([0, 0, 0, 0])
  gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel)

  const image = new Image()
  image.onload = () => {
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image)

    gl.generateMipmap(gl.TEXTURE_2D)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
  }
  image.src = heightmapUrl
}

const heightmapTexture = loadHeightmapTexture()

const animationFrame = debug_trycatch_wrap(
  (timeMilliseconds: number) => {
    const time = timeMilliseconds / 1000
    const timeDelta = time - prevTime

    updateCamera(timeDelta)

    requestAnimationFrame(animationFrame)
    debug_updateInfo(time)

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

    gl.drawArrays(gl.TRIANGLES, 0, 3)

    frameIndex++
    prevTime = time
  },
  { rethrow: false, file: import.meta.url }
)

requestAnimationFrame(animationFrame)
