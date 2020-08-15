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

const _loadShaderCode = (type: number, sourceCode: string) => {
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
  shaderProgram = gl.createProgram()

  debug_reportClear('compile-shader', import.meta.url)

  const vertexShader = _loadShaderCode(gl.VERTEX_SHADER, vertexShaderCode)
  const fragmentShader = _loadShaderCode(gl.FRAGMENT_SHADER, fragmentShaderCode)

  gl.linkProgram(shaderProgram)

  debug_checkShaderProgramLinkStatus(gl, shaderProgram, {
    title: 'shader program',
    context: 'compile-shader',
    file: import.meta.url
  })

  gl.useProgram(shaderProgram)

  gl.deleteShader(vertexShader)
  gl.deleteShader(fragmentShader)

  shaderProgram_iResolution = gl.getUniformLocation(shaderProgram, 'iResolution')
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
