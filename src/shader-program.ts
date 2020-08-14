import { gl } from './gl'

import vertexShaderCode from './shaders/vertex.vert'
import fragmentShaderCode from './shaders/fragment.frag'
import { debug_exec } from './debug/debug'

export const shaderProgram = gl.createProgram()

const _loadShaderCode = (type: number, sourceCode: string) => {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, sourceCode)
  gl.compileShader(shader)

  debug_exec(() => {
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error(
        `Could not compile ${type === gl.VERTEX_SHADER ? 'vertex' : 'fragment'} shader\n\n${
          gl.getShaderInfoLog(shader) || 'compilation failed'
        }`
      )
    }
  })

  gl.attachShader(shaderProgram, shader)
}

_loadShaderCode(gl.VERTEX_SHADER, vertexShaderCode)
_loadShaderCode(gl.FRAGMENT_SHADER, fragmentShaderCode)

gl.linkProgram(shaderProgram)

debug_exec(() => {
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    throw new Error(`Could not link shader program\n\n${gl.getShaderInfoLog(shaderProgram) || 'link failed'}`)
  }

  gl.validateProgram(shaderProgram)
  if (!gl.getProgramParameter(shaderProgram, gl.VALIDATE_STATUS)) {
    const info = gl.getProgramInfoLog(shaderProgram)
    throw new Error(`Could not validate shader program\n\n${info}`)
  }
})

gl.useProgram(shaderProgram)

export const shaderProgram_iResolution = gl.getUniformLocation(shaderProgram, 'iResolution')
