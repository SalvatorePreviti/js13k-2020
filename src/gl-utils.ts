import { debug_checkShaderProgramLinkStatus, debug_reportClear, debug_checkShaderCompileStatus } from './debug'
import {
  GL_TRIANGLES,
  GL_VERTEX_SHADER,
  GL_FRAGMENT_SHADER,
  GL_TEXTURE_2D,
  GL_CLAMP_TO_EDGE,
  GL_LINEAR,
  GL_TEXTURE_MAG_FILTER,
  GL_TEXTURE_MIN_FILTER,
  GL_TEXTURE_WRAP_T,
  GL_TEXTURE_WRAP_S
} from './core/gl-constants'
import {
  gl_drawArrays,
  gl_createShader,
  gl_shaderSource,
  gl_compileShader,
  gl_attachShader,
  gl_createProgram,
  gl_linkProgram,
  gl_useProgram,
  gl_deleteShader,
  gl_texParameteri,
  gl_context,
  gl_getUniformLocation
} from './gl_context'

import { newProxyGetter } from './core/objects'

export const glDrawFullScreenTriangle = () => {
  gl_drawArrays(GL_TRIANGLES, 0, 3)
}

export const loadShaderCode = (program: WebGLProgram, type: number, sourceCode: string, name: string) => {
  const shader = gl_createShader(type)
  gl_shaderSource(shader, sourceCode)
  gl_compileShader(shader)

  debug_checkShaderCompileStatus(gl_context, shader, {
    title: type === GL_VERTEX_SHADER ? 'vertex shader' : 'fragment shader',
    context: `compile-shader-${name}`,
    file: import.meta.url
  })

  gl_attachShader(program, shader)
  return shader
}

export const loadShaderProgram = (vertexSourceCode: string, fragmentSourceCode: string, name: string): WebGLProgram => {
  // A new program

  const result = gl_createProgram()

  debug_reportClear(`compile-shader-${name}`, import.meta.url)

  // Compile vertex and pixel shader

  const vertexShader = loadShaderCode(result, GL_VERTEX_SHADER, vertexSourceCode, name)
  const fragmentShader = loadShaderCode(result, GL_FRAGMENT_SHADER, fragmentSourceCode, name)

  // Link them together

  gl_linkProgram(result)

  debug_checkShaderProgramLinkStatus(gl_context, result, {
    title: 'shader program',
    context: `compile-shader-${name}`,
    file: import.meta.url
  })

  // Activate the program

  gl_useProgram(result)

  // We don't need the shaders anymore, let's free some memory

  gl_deleteShader(vertexShader)
  gl_deleteShader(fragmentShader)

  return result
}

export const glSetTextureLinearSampling = (target = GL_TEXTURE_2D) => {
  gl_texParameteri(target, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE)
  gl_texParameteri(target, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE)
  gl_texParameteri(target, GL_TEXTURE_MIN_FILTER, GL_LINEAR)
  gl_texParameteri(target, GL_TEXTURE_MAG_FILTER, GL_LINEAR)
}

export const glNewUniformLocationGetter = (program: WebGLProgram) =>
  newProxyGetter((name) => gl_getUniformLocation(program, name))
