import { gl } from './gl'

import { code as vertexShaderCode } from './shaders/vertex.vert'
import { code as fragmentShaderCode } from './shaders/fragment.frag'
import {
  debug_log,
  debug_reportClear,
  debug_checkShaderProgramLinkStatus,
  debug_checkShaderCompileStatus
} from './debug'

export let shaderProgram: WebGLProgram

export let shaderProgram_iResolution: WebGLUniformLocation

export let shaderProgram_iTime: WebGLUniformLocation

export let shaderProgram_iFrame: WebGLUniformLocation

export let shaderProgram_iMouse: WebGLUniformLocation

export let shaderProgram_iCameraPos: WebGLUniformLocation

export let shaderProgram_iCameraDir: WebGLUniformLocation

const loadShaderCode = (type: number, sourceCode: string) => {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, sourceCode)
  gl.compileShader(shader)

  debug_checkShaderCompileStatus(gl, shader, {
    title: type === gl.VERTEX_SHADER ? 'vertex shader' : 'fragment shader',
    context: 'compile-shader',
    file: import.meta.url
  })

  gl.attachShader(shaderProgram, shader)
  return shader
}

const loadShaderProgram = () => {
  // A new program

  shaderProgram = gl.createProgram()

  debug_reportClear('compile-shader', import.meta.url)

  // Compile vertex and pixel shader

  const vertexShader = loadShaderCode(gl.VERTEX_SHADER, vertexShaderCode)
  const fragmentShader = loadShaderCode(gl.FRAGMENT_SHADER, fragmentShaderCode)

  // Link them together

  gl.linkProgram(shaderProgram)

  debug_checkShaderProgramLinkStatus(gl, shaderProgram, {
    title: 'shader program',
    context: 'compile-shader',
    file: import.meta.url
  })

  // Activate the program

  gl.useProgram(shaderProgram)

  // We don't need the shaders anymore, let's free some memory

  gl.deleteShader(vertexShader)
  gl.deleteShader(fragmentShader)

  // Loads uniforms

  const getUniformLocation = (name) => gl.getUniformLocation(shaderProgram, name)

  shaderProgram_iResolution = getUniformLocation('iResolution')
  shaderProgram_iTime = getUniformLocation('iTime')
  shaderProgram_iFrame = getUniformLocation('iFrame')
  shaderProgram_iCameraPos = getUniformLocation('iCameraPos')
  shaderProgram_iCameraDir = getUniformLocation('iCameraDir')
}

loadShaderProgram()

if (import.meta.hot) {
  const reload = () => {
    debug_log('reloading shaders')
    gl.deleteProgram(shaderProgram)
    loadShaderProgram()
  }
  import.meta.hot.on('/src/shaders/vertex.vert', reload)
  import.meta.hot.on('/src/shaders/fragment.frag', reload)
}
