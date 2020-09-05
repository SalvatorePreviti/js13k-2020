import { code as vertexShaderCode } from './shaders/vertex.vert'
import { code as fragmentShaderCode } from './shaders/fragment.frag'
import {
  debug_time,
  debug_timeEnd,
  debug_mode,
  debug_exec,
  debug_reportClear,
  debug_checkShaderProgramLinkStatus,
  debug_checkShaderCompileStatus
} from './debug'
import {
  gl_deleteProgram,
  gl_uniform1i,
  gl_useProgram,
  gl_uniform2f,
  gl_uniformMatrix3fv,
  gl_viewport,
  gl_uniform4f,
  gl_uniform3f,
  gl_createProgram,
  gl_linkProgram,
  gl_context,
  gl_deleteShader,
  gl_attachShader,
  gl_createShader,
  gl_shaderSource,
  gl_compileShader,
  gl_getUniformLocation
} from './gl/gl-context'
import { cameraPos, cameraDir, cameraMat3 } from './camera'

import { GAME_OBJECTS } from './state/objects'
import { ANIMATIONS } from './state/animations'
import { sin, cos } from './math/scalar'
import { vec3Normalize, vec3Temp0, vec3Set } from './math/vec3'
import { GL_VERTEX_SHADER, GL_FRAGMENT_SHADER } from './gl/gl-constants'
import { newProxyGetter } from './core/objects'

export const loadMainShaderProgram = (mainFunction: string) => {
  debug_time(`${loadMainShaderProgram.name} ${mainFunction}`)

  // A new program

  const program = gl_createProgram()

  debug_reportClear(`compile-shader-${name}`, import.meta.url)

  const loadShaderCode = (type: number, sourceCode: string) => {
    const shader = gl_createShader(type)
    gl_shaderSource(shader, sourceCode)
    gl_compileShader(shader)

    debug_checkShaderCompileStatus(gl_context, shader, {
      title: type === GL_VERTEX_SHADER ? 'vertex shader' : 'fragment shader',
      context: `compile-shader-${mainFunction}`,
      file: import.meta.url
    })

    gl_attachShader(program, shader)
    return shader
  }

  // Compile vertex and pixel shader

  const vertexShader = loadShaderCode(GL_VERTEX_SHADER, vertexShaderCode)
  const fragmentShader = loadShaderCode(GL_FRAGMENT_SHADER, fragmentShaderCode.replace(`main_${mainFunction}`, 'main'))

  // Link them together

  gl_linkProgram(program)

  debug_checkShaderProgramLinkStatus(gl_context, program, {
    title: 'shader program',
    context: `compile-shader-${name}`,
    file: import.meta.url
  })

  // Activate the program

  gl_useProgram(program)

  const {
    tN: iNoise,
    tH: iHeightmap,
    tP: iPrerendered,
    tS: iScreens,
    iR: iResolution,
    iM: iCameraMat3,
    iS: iSunDirection,
    iP,
    iD,
    iF,
    iA,
    iB
  } = newProxyGetter((uniform: string) => gl_getUniformLocation(program, uniform))

  // Texture 0
  gl_uniform1i(iNoise, 0)

  // Texture 1
  gl_uniform1i(iHeightmap, 1)

  // Texture 2
  gl_uniform1i(iPrerendered, 2)

  // Texture 3
  gl_uniform1i(iScreens, 3)

  const useShader = (time: number, width: number, height: number) => {
    gl_viewport(0, 0, width, height)
    gl_useProgram(program)

    // Render output resolution
    gl_uniform2f(iResolution, width, height)

    // Sun directiom
    const waterLevel = sin(time * 2 + 3) * 0.2
    vec3Normalize(vec3Set(vec3Temp0, cos(time * 0.02), sin(time * 0.02) * 0.5 + 0.8, sin(time * 0.02)))
    gl_uniform4f(iSunDirection, vec3Temp0.x, vec3Temp0.y, vec3Temp0.z, waterLevel)

    // Camera position and time
    gl_uniform3f(iP, cameraPos.x, cameraPos.y, cameraPos.z)

    // Camera direction and water level
    gl_uniform4f(iD, cameraDir.x, cameraDir.y, cameraDir.z, time)

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

    gl_uniform4f(
      iA,
      // prison door, open-closed
      ANIMATIONS._prisonDoor._value,
      // antenna door, open-closed
      ANIMATIONS._antennaDoor._value,
      // monument Descend
      ANIMATIONS._monumentDescend._value,
      // ramp to oil rig
      ANIMATIONS._oilrigRamp._value
    )

    gl_uniform4f(
      iB,
      // wheel on oil rig
      ANIMATIONS._oilrigWheel._value,
      // antenna rotation
      ANIMATIONS._antennaRotation._value,
      // elevator height
      ANIMATIONS._elevatorHeight._value,
      // submarine position
      ANIMATIONS._submarine._value
    )
  }

  if (debug_mode) {
    gl_deleteShader(vertexShader)
    gl_deleteShader(fragmentShader)
    useShader._program = program
  }

  debug_timeEnd(`${loadMainShaderProgram.name} ${mainFunction}`)
  return useShader
}

export type UseShaderFunction = ReturnType<typeof loadMainShaderProgram>

export let mainShader: UseShaderFunction

export let collisionShader: UseShaderFunction

export let prerenderedShader: UseShaderFunction

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
  mainShader = loadMainShaderProgram('m')
  collisionShader = loadMainShaderProgram('c')
  prerenderedShader = loadMainShaderProgram('p')
}
