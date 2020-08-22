import { canvasElement } from './canvas'
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

export const gl = canvasElement.getContext('webgl2', {
  /** Boolean that indicates if the canvas contains an alpha buffer. */
  alpha: false,
  /** Boolean that hints the user agent to reduce the latency by desynchronizing the canvas paint cycle from the event loop */
  desynchronized: true,
  /** Boolean that indicates whether or not to perform anti-aliasing. */
  antialias: false,
  /** Boolean that indicates that the drawing buffer has a depth buffer of at least 16 bits. */
  depth: false,
  /** Boolean that indicates if a context will be created if the system performance is low or if no hardware GPU is available. */
  failIfMajorPerformanceCaveat: false,
  /** A hint to the user agent indicating what configuration of GPU is suitable for the WebGL context. */
  powerPreference: 'high-performance',
  /** If the value is true the buffers will not be cleared and will preserve their values until cleared or overwritten. */
  preserveDrawingBuffer: false,
  /** Boolean that indicates that the drawing buffer has a stencil buffer of at least 8 bits. */
  stencil: false
})

export const glDrawFullScreenTriangle = () => {
  gl.drawArrays(GL_TRIANGLES, 0, 3)
}

export const loadShaderCode = (program: WebGLProgram, type: number, sourceCode: string, name: string) => {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, sourceCode)
  gl.compileShader(shader)

  debug_checkShaderCompileStatus(gl, shader, {
    title: type === GL_VERTEX_SHADER ? 'vertex shader' : 'fragment shader',
    context: `compile-shader-${name}`,
    file: import.meta.url
  })

  gl.attachShader(program, shader)
  return shader
}

export const loadShaderProgram = (vertexSourceCode: string, fragmentSourceCode: string, name: string): WebGLProgram => {
  // A new program

  const result = gl.createProgram()

  debug_reportClear(`compile-shader-${name}`, import.meta.url)

  // Compile vertex and pixel shader

  const vertexShader = loadShaderCode(result, GL_VERTEX_SHADER, vertexSourceCode, name)
  const fragmentShader = loadShaderCode(result, GL_FRAGMENT_SHADER, fragmentSourceCode, name)

  // Link them together

  gl.linkProgram(result)

  debug_checkShaderProgramLinkStatus(gl, result, {
    title: 'shader program',
    context: `compile-shader-${name}`,
    file: import.meta.url
  })

  // Activate the program

  gl.useProgram(result)

  // We don't need the shaders anymore, let's free some memory

  gl.deleteShader(vertexShader)
  gl.deleteShader(fragmentShader)

  return result
}

export const glSetTextureLinearSampling = (target = GL_TEXTURE_2D) => {
  gl.texParameteri(target, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE)
  gl.texParameteri(target, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE)
  gl.texParameteri(target, GL_TEXTURE_MIN_FILTER, GL_LINEAR)
  gl.texParameteri(target, GL_TEXTURE_MAG_FILTER, GL_LINEAR)
}

/*

for (const key of Object.getOwnPropertyNames(Object.getPrototypeOf(gl))) {
  /*if (key.startsWith('uniform')) {
    console.log(key)
  }
  let s = ''
  if (typeof gl[key] === 'function') {
    s += `export const gl_${key} = gl.${key}.bind(gl)\n`
  }
}

const funcso = []
for (const key of Object.getOwnPropertyNames(Object)) {
  if (typeof Object[key] === 'function') {
    funcso.push(`${key}: object${key.charAt(0).toUpperCase()}${key.slice(1)}`)
  }
}

const funcsr = []
for (const key of Object.getOwnPropertyNames(Array)) {
  if (typeof Array[key] === 'function') {
    funcsr.push(`${key}: reflect${key.charAt(0).toUpperCase()}${key.slice(1)}`)
  }
}

console.log(JSON.stringify(funcso.join(',')))
console.log(JSON.stringify(funcsr.join(',')))

export const gl_uniform1ui,
export const gl_uniform1uiv,
export const gl_uniform2ui,
export const gl_uniform2uiv,
export const gl_uniform3ui,
export const gl_uniform3uiv,
export const gl_uniform4ui,
export const gl_uniform4uiv,
export const gl_uniformMatrix2x3fv,
export const gl_uniformMatrix2x4fv,
export const gl_uniformMatrix3x2fv,
export const gl_uniformMatrix3x4fv,
export const gl_uniformMatrix4x2fv,
export const gl_uniformMatrix4x3fv,
export const gl_uniform1fv,
export const gl_uniform1iv,
export const gl_uniform2fv,
export const gl_uniform2iv,
export const gl_uniform3fv,
export const gl_uniform3iv,
export const gl_uniform4fv,
export const gl_uniform4iv,
export const gl_uniformMatrix2fv,
export const gl_uniformMatrix3fv,
export const gl_uniformMatrix4fv,
export const gl_uniform1f ,
export const gl_uniform1i ,
export const gl_uniform2f ,
export const gl_uniform2i ,
export const gl_uniform3f ,
export const gl_uniform3i ,
export const gl_uniform4f ,
export const gl_uniform4i ,
export const gl_uniform1fv ,
gl_uniform1iv ,
gl_uniform2fv,
gl_uniform2iv,
gl_uniform3fv,
gl_uniform3iv,
gl_uniform4fv,
gl_uniform4iv,
gl_uniformMatrix2fv,
gl_uniformMatrix3fv,
gl_uniformMatrix4fv,


export type UniformWriterType = 
uniform1f(x: GLfloat): void |
uniform1i( x: GLint): void |
uniform2f( x: GLfloat, y: GLfloat): void |
uniform2i( x: GLint, y: GLint): void |
uniform3f( x: GLfloat, y: GLfloat, z: GLfloat): void |
uniform3i( x: GLint, y: GLint, z: GLint): void |
uniform4f( x: GLfloat, y: GLfloat, z: GLfloat, w: GLfloat): void |
uniform4i(x: GLint, y: GLint, z: GLint, w: GLint): void |

export const glUniformWriter = (uniformName: string, uniformType: UniformWriterType): */
