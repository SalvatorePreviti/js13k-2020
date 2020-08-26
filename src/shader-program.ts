import { loadShaderProgram, glNewUniformLocationGetter } from './gl-utils'

import { code as vertexShaderCode } from './shaders/vertex.vert'
import { code as fragmentShaderCode } from './shaders/fragment.frag'
import { debug_time, debug_timeEnd, debug_mode, debug_exec } from './debug'
import {
  gl_deleteProgram,
  gl_uniform1i,
  gl_useProgram,
  gl_uniform1f,
  gl_uniform3f,
  gl_uniform2f,
  gl_uniformMatrix3fv,
  gl_viewport
} from './gl_context'
import { cameraPos, cameraDir, cameraEuler, cameraMat3, flashlightOn } from './camera'
import { GAME_OBJECTS } from './objects'
import { ANIMATIONS } from './animations'

const _loadMainShaderProgram = (mainFunction: string) => {
  debug_time(`${_loadMainShaderProgram.name} ${mainFunction}`)

  const program = loadShaderProgram(
    vertexShaderCode,
    fragmentShaderCode.replace('\n', `\n#define ${mainFunction} main\n${debug_mode ? '#line 2 0\n' : ''}`),
    mainFunction
  )

  const {
    iHeightmap,
    iNoise,
    iResolution,
    iTime,
    iCameraPos,
    iCameraDir,
    iCameraEuler,
    iCameraMat3,
    iGOKeyVisible,
    iAnimPrisonDoor,
    iFlashlightOn
  } = glNewUniformLocationGetter(program)

  // Texture 0
  gl_uniform1i(iHeightmap, 0)

  // Texture 1
  gl_uniform1i(iNoise, 1)

  const _use = (time: number, width: number, height: number) => {
    gl_viewport(0, 0, width, height)
    gl_useProgram(program)

    // Render output resolution
    gl_uniform2f(iResolution, width, height)

    // Time in seconds
    gl_uniform1f(iTime, time)

    // Camera position
    gl_uniform3f(iCameraPos, cameraPos.x, cameraPos.y, cameraPos.z)

    // Camera direction
    gl_uniform3f(iCameraDir, cameraDir.x, cameraDir.y, cameraDir.z)

    // Camera rotation, x is yaw and y is pitch
    gl_uniform2f(iCameraEuler, cameraEuler.x, cameraEuler.y)

    // Camera rotation matrix
    gl_uniformMatrix3fv(iCameraMat3, false, cameraMat3)

    //Key visibility
    gl_uniform1i(iGOKeyVisible, GAME_OBJECTS._key._visible ? 1 : 0)

    //prison door, open-closed
    gl_uniform1f(iAnimPrisonDoor, ANIMATIONS._prisonDoor._value)

    gl_uniform1i(iFlashlightOn, flashlightOn ? 1 : 0)
  }

  const result = {
    _program: program,
    _use
  }

  debug_timeEnd(`${_loadMainShaderProgram.name} ${mainFunction}`)
  return result
}

export type MainShaderProgram = ReturnType<typeof _loadMainShaderProgram>

export let mainShader: MainShaderProgram

export let collisionShader: MainShaderProgram

export const loadMainShader = () => {
  debug_exec(() => {
    if (mainShader) {
      gl_deleteProgram(mainShader._program)
    }
    if (collisionShader) {
      gl_deleteProgram(collisionShader._program)
    }
  })

  mainShader = _loadMainShaderProgram('main_')
  collisionShader = _loadMainShaderProgram('main_coll')
}
