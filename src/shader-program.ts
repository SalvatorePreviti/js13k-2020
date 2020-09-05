import { loadShaderProgram, glNewUniformLocationGetter } from './gl/gl-utils'

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
} from './gl/gl-context'
import { cameraPos, cameraDir, cameraEuler, cameraMat3 } from './camera'

import { GAME_OBJECTS } from './state/objects'
import { ANIMATIONS } from './state/animations'

export const loadMainShaderProgram = (mainFunction: string) => {
  debug_time(`${loadMainShaderProgram.name} ${mainFunction}`)

  const program = loadShaderProgram(
    vertexShaderCode,
    fragmentShaderCode.replace('\n', `\n#define main_${mainFunction} main\n${debug_mode ? '#line 2 0\n' : ''}`),
    mainFunction
  )

  const {
    iNoise,
    iHeightmap,
    iPrerendered,
    iScreens,
    iResolution,
    iTime,
    iCameraPos,
    iCameraDir,
    iCameraEuler,
    iCameraMat3,
    iGOKeyVisible,
    iGOFlashlightVisible,
    iGOAntennaKeyVisible,
    iGOFloppyDiskVisible,
    iAnimPrisonDoor,
    iAnimAntennaDoor,
    iAnimMonumentDescend,
    iAnimOilrigRamp,
    iAnimOilrigWheel,
    iAnimAntennaRotation,
    iAnimElevatorHeight,
    iFlashlightOn
  } = glNewUniformLocationGetter(program)

  // Texture 0
  gl_uniform1i(iNoise, 0)

  // Texture 1
  gl_uniform1i(iHeightmap, 1)

  // Texture 2
  gl_uniform1i(iPrerendered, 2)

  // Texture 3
  gl_uniform1i(iScreens, 3)

  const _use = (time: number, width: number, height: number) => {
    gl_viewport(0, 0, width, height)
    gl_useProgram(program)

    // Render output resolution
    gl_uniform2f(iResolution, width, height)

    // Time in seconds
    gl_uniform1f(iTime, time)

    // Camera position
    gl_uniform3f(iCameraPos, cameraPos.x, cameraPos.y, cameraPos.z) // If game is not started we should use gl_uniform3f(iCameraPos, 8, 28, 34)

    // Camera direction
    gl_uniform3f(iCameraDir, cameraDir.x, cameraDir.y, cameraDir.z)

    // Camera rotation, x is yaw and y is pitch
    gl_uniform2f(iCameraEuler, cameraEuler.x, cameraEuler.y)

    // Camera rotation matrix
    gl_uniformMatrix3fv(iCameraMat3, false, cameraMat3)

    //Key visibility
    gl_uniform1i(iGOKeyVisible, GAME_OBJECTS._key._visible ? 1 : 0)
    //Torch visibility
    gl_uniform1i(iGOFlashlightVisible, GAME_OBJECTS._flashlight._visible ? 1 : 0)
    //Antenna Key visibility
    gl_uniform1i(iGOAntennaKeyVisible, GAME_OBJECTS._antennaKey._visible ? 1 : 0)
    //Floppy Disk visibility
    gl_uniform1i(iGOFloppyDiskVisible, GAME_OBJECTS._floppyDisk._visible ? 1 : 0)
    //prison door, open-closed
    gl_uniform1f(iAnimPrisonDoor, ANIMATIONS._prisonDoor._value)

    //antenna door, open-closed
    gl_uniform1f(iAnimAntennaDoor, ANIMATIONS._antennaDoor._value)

    //monument Descend
    gl_uniform1f(iAnimMonumentDescend, ANIMATIONS._monumentDescend._value)

    //ramp to oil rig
    gl_uniform1f(iAnimOilrigRamp, ANIMATIONS._oilrigRamp._value)

    //wheel on oil rig
    gl_uniform1f(iAnimOilrigWheel, ANIMATIONS._oilrigWheel._value)
    //antenna rotation
    gl_uniform1f(iAnimAntennaRotation, ANIMATIONS._antennaRotation._value)
    //elevator height
    gl_uniform1f(iAnimElevatorHeight, ANIMATIONS._elevatorHeight._value)

    gl_uniform1i(iFlashlightOn, GAME_OBJECTS._flashlight._active ? 1 : 0)
  }

  const result = {
    _program: program,
    _use
  }

  debug_timeEnd(`${loadMainShaderProgram.name} ${mainFunction}`)
  return result
}

export type MainShaderProgram = ReturnType<typeof loadMainShaderProgram>

export let mainShader: MainShaderProgram

export let collisionShader: MainShaderProgram

export let prerenderedShader: MainShaderProgram

export const loadMainShader = () => {
  debug_exec(() => {
    if (mainShader) {
      gl_deleteProgram(mainShader._program)
    }
    if (collisionShader) {
      gl_deleteProgram(collisionShader._program)
    }
    if (prerenderedShader) {
      gl_deleteProgram(prerenderedShader._program)
    }
  })
  mainShader = loadMainShaderProgram('')
  collisionShader = loadMainShaderProgram('c')
  prerenderedShader = loadMainShaderProgram('p')
}
