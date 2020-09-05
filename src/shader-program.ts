import { loadShaderProgram, glNewUniformLocationGetter } from './gl/gl-utils'

import { code as vertexShaderCode } from './shaders/vertex.vert'
import { code as fragmentShaderCode } from './shaders/fragment.frag'
import { debug_time, debug_timeEnd, debug_mode, debug_exec } from './debug'
import {
  gl_deleteProgram,
  gl_uniform1i,
  gl_useProgram,
  gl_uniform1f,
  gl_uniform2f,
  gl_uniformMatrix3fv,
  gl_viewport,
  gl_uniform4f
} from './gl/gl-context'
import { cameraPos, cameraDir, cameraMat3 } from './camera'

import { GAME_OBJECTS } from './state/objects'
import { ANIMATIONS } from './state/animations'
import { sin } from './math/scalar'

export const loadMainShaderProgram = (mainFunction: string) => {
  debug_time(`${loadMainShaderProgram.name} ${mainFunction}`)

  const program = loadShaderProgram(
    vertexShaderCode,
    fragmentShaderCode.replace('\n', `\n#define main_${mainFunction} main\n${debug_mode ? '#line 2 0\n' : ''}`),
    mainFunction
  )

  const {
    tN: iNoise,
    tH: iHeightmap,
    tP: iPrerendered,
    tS: iScreens,
    iR: iResolution,
    iP,
    iD,
    iM: iCameraMat3,
    iF,
    iAnimPrisonDoor,
    iAnimAntennaDoor,
    iAnimMonumentDescend,
    iAnimOilrigRamp,
    iAnimOilrigWheel,
    iAnimAntennaRotation,
    iAnimElevatorHeight,
    iSubmarineHeight
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
    const waterLevel = sin(time * 2 + 3) * 0.2

    gl_viewport(0, 0, width, height)
    gl_useProgram(program)

    // Render output resolution
    gl_uniform2f(iResolution, width, height)

    // Camera position
    gl_uniform4f(iP, cameraPos.x, cameraPos.y, cameraPos.z, time)

    // Camera direction
    gl_uniform4f(iD, cameraDir.x, cameraDir.y, cameraDir.z, waterLevel)

    // Camera rotation matrix
    gl_uniformMatrix3fv(iCameraMat3, false, cameraMat3)

    gl_uniform1i(
      iF,
      (GAME_OBJECTS._flashlight._active ? 0x01 : 0) |
        (GAME_OBJECTS._key._visible ? 0x02 : 0) |
        (GAME_OBJECTS._flashlight._visible ? 0x04 : 0) |
        (GAME_OBJECTS._antennaKey._visible ? 0x08 : 0) |
        (GAME_OBJECTS._floppyDisk._visible ? 0x10 : 0)
    )

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

    gl_uniform1f(iSubmarineHeight, ANIMATIONS._submarine._value)
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
