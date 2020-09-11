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
import { cameraPos, cameraDir, cameraMat3, headBob } from './camera'

import { GAME_OBJECTS } from './state/objects'
import { ANIMATIONS } from './state/animations'
import { sin, cos, min } from './math/scalar'
import { vec3Normalize, vec3Temp0, vec3Set } from './math/vec3'
import { GL_VERTEX_SHADER, GL_FRAGMENT_SHADER } from './gl/gl-constants'
import { gl } from './page'
import { gameTime } from './time'

export const loadShaderFunction = (mainFunction: string) => {
  debug_time(`${loadShaderFunction.name} ${mainFunction}`)

  // A new program

  const program = gl.createProgram()

  debug_reportClear(`compile-shader-${name}`, import.meta.url)

  const loadShaderCode = (type: number, sourceCode: string) => {
    const shader = gl.createShader(type)
    gl.shaderSource(shader, sourceCode)
    gl.compileShader(shader)

    debug_checkShaderCompileStatus(gl, shader, {
      title: type === GL_VERTEX_SHADER ? 'vertex shader' : 'fragment shader',
      context: `compile-shader-${mainFunction}`,
      file: import.meta.url
    })

    gl.attachShader(program, shader)
    return shader
  }

  // Compile vertex and pixel shader

  const vertexShader = loadShaderCode(GL_VERTEX_SHADER, vertexShaderCode)
  const fragmentShader = loadShaderCode(GL_FRAGMENT_SHADER, fragmentShaderCode.replace(`main_${mainFunction}`, 'main'))

  // Link them together

  gl.linkProgram(program)

  debug_checkShaderProgramLinkStatus(gl, program, {
    title: 'shader program',
    context: `compile-shader-${name}`,
    file: import.meta.url
  })

  // Activate the program

  gl.useProgram(program)

  const iNoise = gl.getUniformLocation(program, 'tN')
  const iHeightmap = gl.getUniformLocation(program, 'tH')
  const iPrerendered = gl.getUniformLocation(program, 'tP')
  const iScreens = gl.getUniformLocation(program, 'tS')
  const iResolution = gl.getUniformLocation(program, 'iR')
  const iCameraMat3 = gl.getUniformLocation(program, 'iM')
  const iSunDirection = gl.getUniformLocation(program, 'iS')
  const iP = gl.getUniformLocation(program, 'iP')
  const iD = gl.getUniformLocation(program, 'iD')
  const iF = gl.getUniformLocation(program, 'iF')
  const iA = gl.getUniformLocation(program, 'iA')
  const iB = gl.getUniformLocation(program, 'iB')

  ;[iNoise, iHeightmap, iPrerendered, iScreens].map((t, i) => gl.uniform1i(t, i))

  const useShader = (width: number, height: number, isCollider?: boolean) => {
    gl.viewport(0, 0, width, height)
    gl.useProgram(program)

    // Render output resolution
    gl.uniform2f(iResolution, width, height)

    // Sun directiom
    const waterLevel = sin(gameTime * 2 + 3) * 0.2
    vec3Normalize(vec3Set(vec3Temp0, cos(2328 * 0.02) * 0.5, sin(2328 * 0.02) * 0.5 + 0.8, sin(2328 * 0.02) * 0.5))
    gl.uniform4f(iSunDirection, vec3Temp0.x, vec3Temp0.y, vec3Temp0.z, waterLevel)

    // Camera position
    gl.uniform3f(iP, cameraPos.x, cameraPos.y + (isCollider ? 0 : headBob), cameraPos.z)

    // Camera direction and global time
    gl.uniform4f(iD, cameraDir.x, cameraDir.y, cameraDir.z, gameTime)

    // Camera rotation matrix
    gl.uniformMatrix3fv(iCameraMat3, false, cameraMat3)

    gl.uniform1i(
      iF,
      (GAME_OBJECTS._flashlight._active && 0x01) |
        (GAME_OBJECTS._key._visible && 0x02) |
        (GAME_OBJECTS._flashlight._visible && 0x04) |
        (GAME_OBJECTS._antennaKey._visible && 0x08) |
        (GAME_OBJECTS._floppyDisk._visible && 0x10)
    )

    gl.uniform4f(
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

    gl.uniform4f(
      iB,
      // wheel on oil rig
      ANIMATIONS._oilrigWheel._value,
      // antenna rotation
      ANIMATIONS._antennaRotation._value,
      // elevator height
      ANIMATIONS._elevatorHeight._value,
      // submarine position
      min(0, ANIMATIONS._submarine._value) + waterLevel
    )
  }

  if (debug_mode) {
    gl.deleteShader(vertexShader)
    gl.deleteShader(fragmentShader)
    useShader._program = program
  }

  debug_timeEnd(`${loadShaderFunction.name} ${mainFunction}`)
  return useShader
}

export type UseShaderFunction = ReturnType<typeof loadShaderFunction>

export let mainShader: UseShaderFunction

export let collisionShader: UseShaderFunction

export let prerenderedShader: UseShaderFunction

export const loadMainShader = () => {
  debug_exec(() => {
    if (mainShader) {
      gl.deleteProgram(mainShader._program)
    }
    if (collisionShader) {
      gl.deleteProgram(collisionShader._program)
    }
    if (prerenderedShader) {
      gl.deleteProgram(prerenderedShader._program)
    }
  })
  mainShader = loadShaderFunction('m')
  collisionShader = loadShaderFunction('c')
  prerenderedShader = loadShaderFunction('p')
}
