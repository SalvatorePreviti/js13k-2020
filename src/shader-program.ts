import { gl } from './gl'

import vertexShaderCode from './shaders/vertex.vert'
import fragmentShaderCode from './shaders/fragment.frag'
import { debug_exec } from './debug'
import { debug_report, debug_reportClear } from './debug'

export const shaderProgram = gl.createProgram()

debug_reportClear('compile-shader', import.meta.url)

const _loadShaderCode = (type: number, sourceCode: string) => {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, sourceCode)
  gl.compileShader(shader)

  debug_exec(() => {
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      debug_report(
        'error',
        `Error compiling ${type === gl.VERTEX_SHADER ? 'vertex' : 'fragment'} shader\n\n${
          gl.getShaderInfoLog(shader) || 'compilation failed'
        }`,
        { context: 'compile-shader', file: import.meta.url }
      )
    } else {
      const infoLog = gl.getShaderInfoLog(shader)
      if (infoLog) {
        debug_report(
          'warn',
          `Error compiling ${type === gl.VERTEX_SHADER ? 'vertex' : 'fragment'} shader\n\n${
            gl.getShaderInfoLog(shader) || 'compilation failed'
          }`,
          { context: 'compile-shader', file: import.meta.url }
        )
      }
    }
  })

  gl.attachShader(shaderProgram, shader)
}

_loadShaderCode(gl.VERTEX_SHADER, vertexShaderCode)
_loadShaderCode(gl.FRAGMENT_SHADER, fragmentShaderCode)

gl.linkProgram(shaderProgram)

debug_exec(() => {
  gl.validateProgram(shaderProgram)

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    debug_report('warn', `Error linking shader program\n\n${gl.getProgramInfoLog(shaderProgram) || 'link failed'}`, {
      context: 'compile-shader',
      file: import.meta.url
    })
  } else {
    const infoLog = gl.getProgramInfoLog(shaderProgram)
    if (infoLog) {
      debug_report('warn', infoLog, {
        context: 'compile-shader',
        file: import.meta.url
      })
    }
  }
})

gl.useProgram(shaderProgram)

export const shaderProgram_iResolution = gl.getUniformLocation(shaderProgram, 'iResolution')
