import './css/styles.less'
import { gl, glDrawFullScreenTriangle, glSetTextureLinearSampling } from './gl'
import { canvasSize } from './canvas'
import { debug_updateInfo, debug_trycatch_wrap, debug_log } from './debug'
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

import heightmapUrl from './heightmap.jpg'
import { buildHeightmapTexture } from './texture-heightmap'

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

  gl.hint(gl.GENERATE_MIPMAP_HINT, gl.NICEST)

  const image = new Image()
  image.onload = () => {
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image)

    glSetTextureLinearSampling()
  }
  image.src = heightmapUrl
}

buildHeightmapTexture()
//loadHeightmapTexture()
loadMainShaderProgram()

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

    // Camera rotation, x is yaw and y is pitch
    gl.uniform2f(shaderProgram_iCameraEuler, cameraEuler.x, cameraEuler.y)

    // Camera rotation matrix
    gl.uniformMatrix3fv(shaderProgram_iCameraMat3, false, cameraMat3)

    glDrawFullScreenTriangle()

    frameIndex++
    prevTime = time
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
